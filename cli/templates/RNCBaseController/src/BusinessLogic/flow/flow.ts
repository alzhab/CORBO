import {EAppEvents, IAppFlow, IFlows} from './types';
import {inject, injectable} from 'inversify';
import {autorun} from 'mobx';
import Splashscreen from 'react-native-splash-screen';
import {AppEventsBlmId, AppEventsStoreId, IAppEventsBlm, IAppEventsStore} from '@corrbo/base/AppEventsModule';
import {IInitialRouteBlm, InitialRouteBlmId} from '@corrbo/base/NavigationModule';

export const AppFlowId = Symbol.for('Flow')

@injectable()
export class Flow implements IAppFlow {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
    @inject(AppEventsBlmId) private appEventBlm: IAppEventsBlm,
    @inject(InitialRouteBlmId) private initialRouteBlm: IInitialRouteBlm,
  ) {}
  
  init() {
    autorun(
      () => {
        const event = this.appEventsStore.event
        if (event?.key) {
          console.log({ event })
          this.appEventsStore.removeEvent()
          const func = this.flows[event.key].bind(this) as any
          func(event.data)
        }
      },
      {
        onError: error => {
          console.log(JSON.stringify(error, null, 2))
        },
      },
    )
    
    this.appEventBlm.emitEvent({ event: EAppEvents.APP_INIT })
  }
  
  get flows(): IFlows {
    return {
      [EAppEvents.APP_INIT]: this.onAppInit,
    }
  }
  
  onAppInit() {
    Splashscreen.hide()
    this.appEventsStore.setIsAppInitialized(true)
  }
}
