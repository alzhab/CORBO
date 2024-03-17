import { inject, injectable } from 'inversify'
import { EAppStateFlowEvents, IAppState } from '../flow'
import { RootNavigationParamsMap } from 'navigations/RootNavigation'
import {
  IInitialRouteActions,
  InitialRouteActionsId,
} from '@corrbo/module-navigation/blm/actions'
import { EVENT_EMITTER } from '@corrbo/base/IOC/IOCProvider'
import { IFlowReactions } from '../../types'

export const AppStateFlowId = Symbol.for('AppStateFlow')
EVENT_EMITTER.addFlowId(AppStateFlowId)

@injectable()
export class AppStateFlow implements IAppState {
  constructor(
    @inject(InitialRouteActionsId)
    private initialRouteActions: IInitialRouteActions,
  ) {}

  get reactions(): IFlowReactions {
    return {
      [EAppStateFlowEvents.ON_APP_OPEN]: this.onAppOpen.bind(this),
    }
  }

  onAppOpen(): void {
    this.initialRouteActions.setInitialRouteName(this.screen)
  }

  get screen(): keyof RootNavigationParamsMap {
    return 'HomeScreen'
  }
}
