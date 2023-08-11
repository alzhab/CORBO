import { inject, injectable } from 'inversify'
import { IAppEventsBlm } from './types'
import { EAppEvents } from 'flow/types'
import { AppEventsStoreId, IAppEventsStore } from '../store'

export const AppEventsBlmId = Symbol.for('AppEventsBlm')

@injectable()
export class AppEventsBlm implements IAppEventsBlm {
  constructor(
    @inject(AppEventsStoreId) private appEventsStore: IAppEventsStore,
  ) {}

  emitEvent<D>(key: EAppEvents, data?: D): void {
    this.appEventsStore.addEvent(key, data)
  }
}
