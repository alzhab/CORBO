import { RootNavigationParamsMap } from 'navigations/RootNavigation'

export interface IInitialRouteActions {
  setInitialRouteName(val: keyof RootNavigationParamsMap): void
}
