import { TCommandReturn } from '../types'

export interface IRNCGeneratorsController {
  init(): Promise<TCommandReturn>
}

export enum EGenerators {
  Icons = 'Icons',
  NavigationSync = 'Navigation sync',
  Api = 'Api',
  AppIcon = 'App Icon',
  AppName = 'App name',
}
