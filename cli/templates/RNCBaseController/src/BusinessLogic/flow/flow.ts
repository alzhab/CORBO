import { EAppEvents, IAppFlow } from './types'
import { inject, injectable } from 'inversify'
import { autorun } from 'mobx'
import {
  AppEventsBlmId,
  AppEventsStoreId,
  IAppEventsBlm,
  IAppEventsStore,
} from '@alzhan/rncore-base/AppEventsModule'
import {
  IInitialRouteBlm,
  InitialRouteBlmId,
} from '@alzhan/rncore-base/NavigationModule'

export const AppFlowId = Symbol.for('Flow')

@injectable()
export class Flow implements IAppFlow {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
    @inject(AppEventsBlmId) private appEventBlm: IAppEventsBlm,
    @inject(InitialRouteBlmId) private initialRouteBlm: IInitialRouteBlm,
  ) {}

  init() {
    autorun(() => {
      const eventName = this.appEventsStore.event?.key
      if (eventName) {
        this.flows[eventName]()
      }
    })
  }

  get flows(): { [key in EAppEvents]: () => void } {
    return {
      [EAppEvents.APP_INIT]: this.onAppInit.bind(this),
    }
  }

  onAppInit() {
    setTimeout(() => {
      this.initialRouteBlm.setInitialRouteName('HomeScreen')
      this.appEventsStore.removeEvent()
    }, 3000)
  }
}
