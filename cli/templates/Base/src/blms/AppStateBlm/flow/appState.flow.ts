import {inject, injectable} from 'inversify';
import {IFlowReactions} from 'base/root-flow';
import {EAppStateFlowEvents, IAppState} from 'blm/NetworkStateBlm';
import {RootNavigationParamsMap} from 'navigations/RootNavigation';
import {IInitialRouteActions, InitialRouteActionsId} from '@corrbo/base/Navigation/blm/actions';

export const AppStateFlowId = Symbol.for('AppStateFlow')

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
