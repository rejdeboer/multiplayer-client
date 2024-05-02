import { ApiClient } from "./client";
import type { InterceptorManager } from "./interceptor";
import type { Credentials, Resource, AccessToken, ResourceCreate } from "./types";

export type QueryParams = {};

export class ResourceAdapter {
  private client: ApiClient;

  constructor(apiKey: string) {
    this.client = new ApiClient(apiKey);
  }

  get interceptors(): InterceptorManager {
    return this.client.interceptors;
  }

  async post<C extends ResourceCreate, R extends Resource | void>(
    path: string,
    data?: C,
    params?: QueryParams,
  ): Promise<R> {
    return this.client.request("POST", path, data, params);
  }

  async authenticate(credentials: Credentials): Promise<AccessToken> {
    const token = await this.post<Credentials, AccessToken>("/token", credentials)

    this.client.setToken(token);

    return token
  }
}
