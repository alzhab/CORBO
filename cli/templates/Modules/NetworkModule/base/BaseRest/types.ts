import { AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios'

export interface IBaseRest {
  request<T>(params: RequestParams): Promise<AxiosResponse<T>>
}

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: unknown
  /** request body */
  body?: unknown
  isMock?: boolean
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export type TRequestData<
  B = {},
  Q = {},
  T extends ContentType = ContentType.Json,
> = {
  type?: T
  body?: B
  query?: Q
}

export type TRequest<
  R = {},
  B = {},
  Q = {},
  T extends ContentType = ContentType.Json,
> = (data?: TRequestData<B, Q, T>) => Promise<AxiosResponse<R>>
