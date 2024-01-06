import {inject, injectable} from 'inversify';
import {autorun} from 'mobx';
import {EAppEvents, IAppEventsFlow} from './types';
import {AppEventsStoreId, IAppEventsStore} from '../store';
import {EFlowEvents, IFlowReactions} from 'base/root-flow';
import {AppEventsActionsId, IAppEventsActions} from '../actions';

export const AppEventsFlowsId = Symbol.for('AppEventsFlows')

@injectable()
export class AppEventsFlow implements IAppEventsFlow {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
    @inject(AppEventsActionsId) private appEventActions: IAppEventsActions,
  ) {}
  
  get reactions(): IFlowReactions {
    return {}
  }
  
  subscibeToEvents(reactions: IFlowReactions): void {
    autorun(
      () => {
        const event = this.appEventsStore.event
        console.log({event});
        if (event?.key) {
          this.appEventsStore.removeEvent()
          const func = reactions[event.key].bind(this) as any
          if (func) {
            func(event.data)
          } else {
            console.log('Event function not found: ')
          }
        }
      },
      {
        onError: error => {
          console.log('RootFlow Error: ',JSON.stringify(error, null, 2))
        },
      },
    )
    
    this.appEventActions.emitEvent({ event: EFlowEvents.ON_APP_OPEN})
  }
}
