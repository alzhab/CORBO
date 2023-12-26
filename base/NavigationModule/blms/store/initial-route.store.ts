import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { injectable } from 'inversify'
import { IInitialRouteStore } from './types'
import { RootNavigationParamsMap } from 'navigations/RootNavigation'

export const InitialRouteStoreId = Symbol.for('InitialRouteStore')

@injectable()
export class InitialRouteStore implements IInitialRouteStore {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, { name: 'InitialRouteStore', properties: [] })
  }

  initialScreen: keyof RootNavigationParamsMap | null = null
  setInitialScreen(val: keyof RootNavigationParamsMap | null): void {
    this.initialScreen = val
  }
  
  isNavigationReady: boolean = false
  setIsNavigationReady(val: boolean): void {
    this.isNavigationReady = val
  }
}
