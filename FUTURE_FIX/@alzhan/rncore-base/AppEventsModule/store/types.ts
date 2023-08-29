import { EAppEvents } from 'flow/types'

export interface IAppEventsStore {
  event: { key: EAppEvents; data?: any } | null
  addEvent<D>(key: EAppEvents, data?: D): void
  removeEvent(): void
  
  isAppInitialized: boolean
  setIsAppInitialized(val: boolean): void
}
