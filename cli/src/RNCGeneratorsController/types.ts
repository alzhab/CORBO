import { TCommandReturn } from '../types'

export interface IRNCGeneratorsController {
  init(): Promise<TCommandReturn>
}

export enum EGenerators {
  Api = 'Api',
}
