import Adapter from 'axios-mock-adapter'
import { inject, injectable } from 'inversify'
import { HttpClientId, IHttpClient } from 'services/HttpClientService'
import { AxiosInstance } from 'axios'
import { IMockAdapter } from './types'
import MOCK_CONFIG from 'configs/MockData'
import { EMethods } from 'configs/MockData/types'

export const MockAdapterId = Symbol.for('MockAdapter')

@injectable()
export class MockAdapter implements IMockAdapter {
  $axios: AxiosInstance

  constructor(@inject(HttpClientId) private httpClient: IHttpClient) {
    this.$axios = httpClient.$mockAxios
  }

  init() {
    const mock = new Adapter(this.$axios, { delayResponse: 2000 })

    MOCK_CONFIG.map(({ method, data, api, params, status, errorMessage }) => {
      mock[EMethods[method]](api, params ? { params } : undefined).reply(() => {
        return [
          status,
          {
            data,
            message: errorMessage || '',
          },
        ]
      })
    })
  }
}
