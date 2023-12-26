import {inject, injectable} from 'inversify';
import {autorun} from 'mobx';
import {EAppEvents, IAppEventsFlow} from './types';
import {AppEventsStoreId, IAppEventsStore} from '../store';
import {IFlowReactions} from 'base/root-flow';
import {AppEventsActionsId, IAppEventsActions} from '../actions';

export const AppEventsFlowsId = Symbol.for('AppEventsFlows')

@injectable()
export class AppEventsFlow implements IAppEventsFlow {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
    @inject(AppEventsActionsId) private appEventActions: IAppEventsActions,
  ) {}
  
  get reactions(): IFlowReactions {
    return {
      [EAppEvents.APP_INIT]: this.onAppInit,
    }
  }
  
  onAppInit() {
    this.appEventsStore.setIsAppInitialized(true)
  }
  
  subscibeToEvents(reactions: IFlowReactions): void {
    autorun(
      () => {
        const event = this.appEventsStore.event
        if (event?.key) {
          this.appEventsStore.removeEvent()
          const func = reactions[event.key].bind(this) as any
          func(event.data)
        }
      },
      {
        onError: error => {
          console.log('RootFlow Error: ',error)
        },
      },
    )
    
    this.appEventActions.emitEvent({ event: EAppEvents.APP_INIT })
  }
}
