import { inject, injectable } from 'inversify'
import { IInitialRouteBlm } from './types'
import { RootNavigationParamsMap } from 'navigations/RootNavigation'
import { IInitialRouteStore, InitialRouteStoreId } from '../../stores'

export const InitialRouteBlmId = Symbol.for('InitialRouteBlm')

@injectable()
export class InitialRouteBlm implements IInitialRouteBlm {
  constructor(
    @inject(InitialRouteStoreId) private initialRouteStore: IInitialRouteStore,
  ) {}
  setInitialRouteName(val: keyof RootNavigationParamsMap): void {
    this.initialRouteStore.setInitialScreen(val)
  }
}
