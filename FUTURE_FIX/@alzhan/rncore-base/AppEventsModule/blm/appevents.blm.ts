import { inject, injectable } from 'inversify'
import { IAppEventsBlm } from './types'
import { EAppEvents, IAppEventsData } from "flow/types";
import { AppEventsStoreId, IAppEventsStore } from '../store'

export const AppEventsBlmId = Symbol.for('AppEventsBlm')

@injectable()
export class AppEventsBlm implements IAppEventsBlm {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
  ) {}

  emitEvent<EventName  extends keyof IAppEventsData>(    data: undefined extends IAppEventsData[EventName] ? {event: EventName, data?: IAppEventsData[EventName]} : {event: EventName, data: IAppEventsData[EventName]}): void {
    this.appEventsStore.addEvent(data.event, data.data)
  }
}
