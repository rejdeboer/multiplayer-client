import { ApiClient } from "./client";
import type { InterceptorManager } from "./interceptor";
import type { Credentials, Resource, AccessToken, ResourceCreate } from "./types";

export type QueryParams = {};

export class ResourceAdapter {
  private client: ApiClient;

  constructor(apiKey: string, token?: string) {
    this.client = new ApiClient(apiKey, token);
  }

  get interceptors(): InterceptorManager {
    return this.client.interceptors;
  }

  async get<R extends Resource>(
    path: string,
    params?: QueryParams,
  ): Promise<R> {
    return this.client.request("GET", path, undefined, params);
  }

  async post<C extends ResourceCreate, R extends Resource | void>(
    path: string,
    data?: C,
    params?: QueryParams,
  ): Promise<R> {
    return this.client.request("POST", path, data, params);
  }

  async delete(path: string, id: string): Promise<void> {
    return this.client.request("DELETE", `${path}/${id}`)
  }

  async authenticate(credentials: Credentials): Promise<AccessToken> {
    const token = await this.post<Credentials, AccessToken>("/token", credentials)

    this.client.setToken(token);

    return token
  }
}
