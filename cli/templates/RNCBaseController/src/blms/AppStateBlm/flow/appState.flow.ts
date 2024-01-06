import { inject, injectable } from 'inversify'
import { IFlowReactions } from 'base/root-flow'
import { IInitialRouteActions, InitialRouteActionsId } from '@corrbo/base/NavigationModule/blms'
import { EAppStateFlowEvents, IAppState } from 'blms/AppStateBlm'
import { IOnboardingStore, OnboardingStoreId } from 'blms/OnboardingBlm'
import { AuthenticationStoreId, IAuthenticationStore } from 'blms/AuthenticationBlm'
import { RootNavigationParamsMap } from 'navigations/RootNavigation'

export const AppStateFlowId = Symbol.for('AppStateFlow')

@injectable()
export class AppStateFlow implements IAppState {
  constructor(
    @inject(InitialRouteActionsId)
    private initialRouteActions: IInitialRouteActions,
    @inject(OnboardingStoreId)
    private onboardingStore: IOnboardingStore,
    @inject(AuthenticationStoreId)
    private authenticationStore: IAuthenticationStore,
  ) {}

  get reactions(): IFlowReactions {
    return {
      [EAppStateFlowEvents.ON_APP_OPEN]: this.onAppOpen.bind(this),
    }
  }

  onAppOpen(): void {
    const screen = this.authenticationStore.isAuthorized
      ? this.onboardingStore.needToShow
        ? 'OnboardingScreen'
        : 'BottomBarNavigation'
      : 'BottomBarNavigation'
    this.initialRouteActions.setInitialRouteName(screen)
  }

  get screen(): keyof RootNavigationParamsMap {
    if (!this.authenticationStore.isAuthorized) {
      return 'BottomBarNavigation'
    }

    return this.onboardingStore.needToShow ? 'OnboardingScreen' : 'BottomBarNavigation'
  }
}
