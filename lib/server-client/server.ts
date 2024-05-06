import type {
  ErrorInterceptor,
  InterceptorType,
  RawResponseReader,
  RequestInterceptor,
  ResponseInterceptor,
  ResponseObj,
} from "./interceptor";
import { ResourceAdapter } from "./resource";
import * as api from "./resources";
import { AccessToken } from "./types";

export class ServerClient {
  private readonly adapter: ResourceAdapter;

  public documents: api.Documents;
  public users: api.Users;

  constructor(baseUrl: string) {
    this.adapter = new ResourceAdapter(baseUrl);

    this.documents = new api.Documents(this.adapter);
    this.users = new api.Users(this.adapter);
  }

  async authenticate(
    email: string,
    password: string,
  ): Promise<AccessToken> {
    return await this.adapter.authenticate({ email, password });
  }

  addRequestInterceptor(
    onFulfilled?: RequestInterceptor,
    onRejected?: ErrorInterceptor,
  ): number {
    return this.adapter.interceptors.request.use(onFulfilled, onRejected);
  }

  addResponseInterceptor(
    onFulfilled?: ResponseInterceptor,
    onRejected?: ErrorInterceptor,
  ): number {
    return this.adapter.interceptors.response.use(onFulfilled, onRejected);
  }

  removeInterceptor(type: InterceptorType, id: number): void {
    return this.adapter.interceptors[type].eject(id);
  }

  addRawResponseReader(options?: { headers: boolean }): RawResponseReader {
    const reader: RawResponseReader = {
      id: undefined,
      rawResponse: undefined,
      headers: undefined,
    };

    function rawResponseInterceptor(response: ResponseObj): ResponseObj {
      reader.rawResponse = response?.data;
      if (options?.headers) reader.headers = response.headers;
      return response;
    }

    reader.id = this.addResponseInterceptor(rawResponseInterceptor);

    return reader;
  }

  removeRawResponseReader(reader: number | RawResponseReader): void {
    const id = typeof reader === "number" ? reader : reader?.id;
    if (id != null && id >= 0) this.removeInterceptor("response", id);
  }
}

export const Server = (baseUrl: string): ServerClient =>
  new ServerClient(baseUrl);
