import { ApiClient } from "./client";
import type { InterceptorManager } from "./interceptor";
import type { Resource, ResourceCreate } from "./types";

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
}
