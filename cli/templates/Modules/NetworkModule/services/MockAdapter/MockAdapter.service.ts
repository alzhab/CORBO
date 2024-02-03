import Adapter from 'axios-mock-adapter'
import { inject, injectable } from 'inversify'
import { HttpClientId, IHttpClient } from 'services/HttpClientService'
import { AxiosInstance } from 'axios'
import { IMockAdapter } from './types'
import { MOCK_CONFIG } from 'configs/MockData'
import { Statuses, TMockRequestStatusBtn } from 'configs/MockData/types'
import {
  AppEventsActionsId,
  IAppEventsActions,
} from '@corrbo/base/AppEventsModule'
import { EFlowEvents } from 'base/root-flow'

export const MockAdapterId = Symbol.for('MockAdapter')

@injectable()
export class MockAdapter implements IMockAdapter {
  $axios: AxiosInstance

  constructor(
    @inject(HttpClientId) private httpClient: IHttpClient,
    @inject(AppEventsActionsId) private appEventsActions: IAppEventsActions,
  ) {
    this.$axios = httpClient.$mockAxios
  }

  init() {
    const mock = new Adapter(this.$axios, { delayResponse: 2000 })

    mock.onAny().reply(config => {
      const { url, method } = config
      const route = MOCK_CONFIG[url as any]

      if (route && route.method === method?.toUpperCase()) {
        route.responses = {
          ...route.responses,
          500: { detail: 'Ошибка сервера' },
        }

        const statuses = Object.keys(route.responses).map(Number) as Statuses[]

        const buttons: TMockRequestStatusBtn = onPress =>
          statuses.map(item => ({
            title: item.toString(),
            val: item,
            onPress: () => onPress(item),
          }))

        if (statuses.length) {
          return new Promise(res => {
            this.appEventsActions.emitEvent({
              event: EFlowEvents.ON_CHOOSE_MOCK_REQUEST_STATUS,
              data: {
                buttons: buttons(item => res([item, route.responses[item]])),
              },
            })
          })
        }
      }

      return [200, {}]
    })
  }
}
