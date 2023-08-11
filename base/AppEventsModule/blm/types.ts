import { EAppEvents } from 'flow/types'

export interface IAppEventsBlm {
  emitEvent<D>(key: EAppEvents, data?: D): void
}
