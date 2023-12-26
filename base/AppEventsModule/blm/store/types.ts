import {EFlowEvents} from 'base/root-flow';

export interface IAppEventsStore {
  event: { key: EFlowEvents; data?: any } | null
  addEvent<D>(key: EFlowEvents, data?: D): void
  removeEvent(): void
  
  isAppInitialized: boolean
  setIsAppInitialized(val: boolean): void
}
