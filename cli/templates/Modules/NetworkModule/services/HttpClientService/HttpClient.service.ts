import axios from 'axios'
import { SERVER_URL } from '@env'
import { injectable } from 'inversify'
import { IHttpClient } from './types'

export const HttpClientId = Symbol.for('HttpClient')

@injectable()
export class HttpClient implements IHttpClient {
  public $axios = axios.create({
    baseURL: SERVER_URL + '/api/',
    headers: {},
  })
  public $mockAxios = axios.create({
    baseURL: SERVER_URL + '/api/',
    headers: {},
  })

  constructor() {
    this._setupAxios()
    this._setupMockAxios()
  }

  _setupAxios() {
    this.$axios.interceptors.request.use(
      async config => config,
      err => Promise.reject(err),
    )
  }

  _setupMockAxios() {
    this.$mockAxios.interceptors.request.use(
      async config => config,
      err => Promise.reject(err),
    )
  }
}
