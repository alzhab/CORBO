import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { injectable } from 'inversify'
import { IBootStore } from './types'

export const BootStoreId = Symbol.for('BootStore')

@injectable()
export class BootStore implements IBootStore {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, { name: 'BootStore', properties: [] })
  }

  hideBoot: boolean = false
  setHideBoot(val: boolean): void {
    this.hideBoot = val
  }
}
