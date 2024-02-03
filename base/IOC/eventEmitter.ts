import {inject, injectable} from 'inversify';
import {IAppEventsStore, IEventEmiter} from './types';
import {EFlowEvents, IFlowReactions, IFlowReactionsData} from 'base/root-flow';
import {autorun} from 'mobx';
import {AppEventsStoreId} from './store';

export const EventEmiterId = Symbol.for('EventEmiter')

@injectable()
export class EventEmiter implements IEventEmiter {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
  ) {}
  
  get reactions(): IFlowReactions {
    return {}
  }
  
  subscibeToEvents(reactions: IFlowReactions): void {
    autorun(
      () => {
        const event = this.appEventsStore.event
        if (event?.key) {
          console.log({event});
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
    
    this.emitEvent({ event: EFlowEvents.ON_APP_OPEN})
  }
  
  emitEvent<EventName  extends keyof IFlowReactionsData>(    data: undefined extends IFlowReactionsData[EventName] ? {event: EventName, data?: IFlowReactionsData[EventName]} : {event: EventName, data: IFlowReactionsData[EventName]}): void {
    this.appEventsStore.addEvent(data.event, data.data)
  }
}
