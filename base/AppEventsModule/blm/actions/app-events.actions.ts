import { inject, injectable } from 'inversify'
import { IAppEventsActions } from './types'
import { AppEventsStoreId, IAppEventsStore } from '../store'
import { IFlowReactionsData } from 'base/root-flow'

export const AppEventsActionsId = Symbol.for('AppEventsActions')

@injectable()
export class AppEventsActions implements IAppEventsActions {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
  ) {}

  emitEvent<EventName  extends keyof IFlowReactionsData>(    data: undefined extends IFlowReactionsData[EventName] ? {event: EventName, data?: IFlowReactionsData[EventName]} : {event: EventName, data: IFlowReactionsData[EventName]}): void {
    this.appEventsStore.addEvent(data.event, data.data)
  }
}
