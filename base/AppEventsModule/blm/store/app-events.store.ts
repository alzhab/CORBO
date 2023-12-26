import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { injectable } from 'inversify'
import { IAppEventsStore } from './types'
import {EFlowEvents} from 'base/root-flow';

export const AppEventsStoreId = Symbol.for('AppEventsStore')

@injectable()
export class AppEventsStore implements IAppEventsStore {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, { name: 'AppEventsStore', properties: [] })
  }
  
  event: { key: EFlowEvents; data?: any } | null = null
  addEvent<D>(key: EFlowEvents, data?: D): void {
    this.event = { key, data }
  }

  removeEvent(): void {
    this.event = null
  }
  
  isAppInitialized: boolean= false
  setIsAppInitialized(val: boolean): void {
    this.isAppInitialized   = val
  }
}
