import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { injectable } from 'inversify'
import { IAppEventsStore } from './types'
import { EAppEvents } from 'flow/types'

export const AppEventsStoreId = Symbol.for('AppEventsStore')

@injectable()
export class AppEventsStore implements IAppEventsStore {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, { name: 'AppEventsStore', properties: [] })
  }

  event: { key: EAppEvents; data?: any } | null = null
  addEvent<D>(key: EAppEvents, data?: D): void {
    this.event = { key, data }
  }

  removeEvent(): void {
    this.event = null
  }
}
