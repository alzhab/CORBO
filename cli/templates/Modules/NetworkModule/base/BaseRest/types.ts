import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface IBaseRest {
  get: (
    url: string,
    params?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<any, any>>
  post: (
    url: string,
    body: { [key in string]: any },
    params?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<any, any>>
  put: (
    url: string,
    data?: { [key in string]: any },
    params?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<any, any>>
  delete: (
    url: string,
    params?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<any, any>>
  getError: (error: any) => Promise<IGetErrorValue>
  getFormData: (data: any) => FormData
}

export type HttpType = 'default' | 'mock'

export interface IGetErrorValue {
  error: any
  message: string
}

export type IResponse<D> = Promise<{ data: D }>

export type IRequestParams<
  path = undefined,
  query = undefined,
  body = undefined,
> = {
  path?: path
  query?: query
  body?: body
}
