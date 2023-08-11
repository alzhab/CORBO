import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { inject, injectable } from 'inversify'
import { HttpType, IBaseMock, IGetErrorValue } from './types'
import { HttpClientId, IHttpClient } from '../services'

@injectable()
export class BaseMock implements IBaseMock {
  $http: AxiosInstance
  $mockHttp: AxiosInstance

  constructor(@inject(HttpClientId) private httpClient: IHttpClient) {
    this.$http = httpClient.$axios
    this.$mockHttp = httpClient.$mockAxios
  }

  async get(url: string, params?: AxiosRequestConfig, type?: HttpType) {
    try {
      const http = this.getHttp(type)
      return await http.get(url, params)
    } catch (e) {
      console.log('HTTP GET Error', { e: JSON.stringify(e, null, 2), url })
      return Promise.reject(e)
    }
  }

  async post(
    url: string,
    body: { [key in string]: any },
    params?: AxiosRequestConfig,
    type?: HttpType,
  ) {
    try {
      const http = this.getHttp(type)
      return await http.post(url, body, params)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async put(
    url: string,
    data?: { [key in string]: any },
    params?: AxiosRequestConfig,
    type?: HttpType,
  ) {
    try {
      const http = this.getHttp(type)
      return await http.put(url, data, params)
    } catch (e) {
      console.log('HTTP PUT Error', { e, url })
      return Promise.reject(e)
    }
  }

  async patch(
    url: string,
    data?: { [key in string]: any },
    params?: AxiosRequestConfig,
    type?: HttpType,
  ) {
    try {
      const http = this.getHttp(type)
      return await http.patch(url, data, params)
    } catch (e) {
      console.log('HTTP PATCH Error', { e, url })
      return Promise.reject(e)
    }
  }

  async delete(url: string, params?: AxiosRequestConfig, type?: HttpType) {
    try {
      const http = this.getHttp(type)
      return await http.delete(url, params)
    } catch (e) {
      console.log('HTTP DELETE Error', { e, url })
      return Promise.reject(e)
    }
  }

  getError(error: any): Promise<IGetErrorValue> {
    if (axios.isAxiosError(error)) {
      if (error) {
        console.log(error.response)
        return Promise.reject({
          error,
          message:
            error?.response?.data.message || error.message || 'Unknown error',
        })
      } else {
        return Promise.reject({ error, message: 'Error is empty' })
      }
    } else {
      return Promise.reject({ error, message: 'Not Axios error' })
    }
  }

  getFormData(data: any): FormData {
    const formData = new FormData()

    for (const dataKey in data) {
      if (data.hasOwnProperty(dataKey)) {
        const value = data[dataKey]

        formData.append(dataKey, value)
      }
    }

    return formData
  }

  getHttp(type: HttpType = 'default') {
    switch (type) {
      case 'mock':
        return this.$mockHttp
      default:
        return this.$http
    }
  }
}
