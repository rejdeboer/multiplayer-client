import axios, { AxiosError, AxiosInstance, CreateAxiosDefaults, Method } from "axios";
import type { InterceptorManager } from "./interceptor";
import type { QueryParams } from "./resource";
import type { AccessToken } from "./types";
import { mapServerError } from "./error";

export class ApiClient {
  private client: AxiosInstance;

  public interceptors: InterceptorManager;

  public constructor(baseUrl: string, accessToken?: string) {
    const axiosConfig: CreateAxiosDefaults = {
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        Authorization: accessToken != undefined ? `Bearer ${accessToken}` : undefined,
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
      .then((response) => response.data)
      .catch((e: AxiosError) => mapServerError(e));
  }

  setToken(token: AccessToken) {
    this.client.defaults.headers["Authorization"] = `Bearer ${token.token}`
  }
}
