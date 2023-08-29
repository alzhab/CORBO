import { inject, injectable } from 'inversify'
import { IBootBlm } from './types'
import { BootStoreId, IBootStore } from '../../stores'

export const BootBlmId = Symbol.for('BootBlm')

@injectable()
export class BootBlm implements IBootBlm {
  constructor(@inject(BootStoreId) private bootStore: IBootStore) {}
  hideBoot(): void {
    this.bootStore.setHideBoot(true)
  }
}
