import { inject, injectable } from 'inversify'
import { IInitialRouteActions } from './types'
import { RootNavigationParamsMap } from 'navigations/RootNavigation'
import {IInitialRouteStore, InitialRouteStoreId} from '../store';

export const InitialRouteActionsId = Symbol.for('InitialRouteActions')

@injectable()
export class InitialRouteActions implements IInitialRouteActions {
  constructor(
    @inject(InitialRouteStoreId) private initialRouteStore: IInitialRouteStore,
  ) {}
  setInitialRouteName(val: keyof RootNavigationParamsMap): void {
    this.initialRouteStore.setInitialScreen(val)
  }
}
