import type {
  AxiosError,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from "axios";

type InterceptorManager = {
  request: AxiosInterceptorManager<AxiosRequestConfig>;
  response: AxiosInterceptorManager<any>;
};

type RequestObj = AxiosRequestConfig;
type RequestInterceptor = (
  request: RequestObj,
) => RequestObj | Promise<RequestObj>;

type ResponseObj = AxiosResponse;
type ResponseInterceptor = (response: ResponseObj) => ResponseObj;

type HeadersObj = AxiosResponseHeaders | RawAxiosResponseHeaders;

type ErrorObj = AxiosError;
type ErrorInterceptor = (error: ErrorObj) => ErrorObj;

type InterceptorType = "request" | "response";

type RawResponseReader = {
  id: number | undefined;
  rawResponse: ResponseObj | undefined;
  headers: HeadersObj | undefined;
};

export type {
  InterceptorManager,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  InterceptorType,
};
export type { RequestObj, ResponseObj, ErrorObj, HeadersObj };
export type { RawResponseReader };
