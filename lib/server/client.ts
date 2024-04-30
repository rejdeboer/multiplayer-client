import axios, { AxiosInstance, CreateAxiosDefaults, Method } from "axios";
import type { InterceptorManager } from "./interceptor";
import type { QueryParams } from "./resource";

export class ApiClient {
  private client: AxiosInstance;

  public interceptors: InterceptorManager;

  public constructor(baseUrl: string) {
    const axiosConfig: CreateAxiosDefaults = {
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    this.client = axios.create(axiosConfig);
    this.interceptors = this.client.interceptors;
  }

  async request(
    method: Method,
    url: string,
    data?: any,
    params?: QueryParams,
  ): Promise<any> {
    return this.client
      .request({ method, url, data, params })
      .then((response) => response.data);
  }
}
