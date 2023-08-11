import { AxiosInstance } from 'axios'

export interface IHttpClient {
  $axios: AxiosInstance
  $mockAxios: AxiosInstance
}
