import { injectable } from 'inversify'
import { IMockRequestStatusesStore, IStatusButton } from './types'
import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

export const MockRequestStatusesStoreId = Symbol.for('MockRequestStatusesStore')

@injectable()
export class MockRequestStatusesStore implements IMockRequestStatusesStore {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, { name: 'MockRequestStatusesStore', properties: [] })
  }

  statusButtons: IStatusButton[] = []
  setStatusButtons(val: IStatusButton[]): void {
    this.statusButtons = val
  }

  showMockRequestDialog: boolean = false
  setShowMockRequestDialog(val: boolean): void {
    this.showMockRequestDialog = val
  }
}
