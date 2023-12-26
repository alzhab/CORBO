import { ILayoutGenerator } from './types'
import { injectable } from 'inversify'

export const LayoutGeneratorId = Symbol.for('LayoutGeneratorId')

@injectable()
export class LayoutGenerator implements ILayoutGenerator {
  init(): Promise<void> {
    return Promise.resolve(undefined)
  }

  eachRecursive(obj: any) {
    for (const k in obj) {
      if (k === 'children' && typeof obj[k] === 'object') {
      } else {
      }
    }
  }
}
