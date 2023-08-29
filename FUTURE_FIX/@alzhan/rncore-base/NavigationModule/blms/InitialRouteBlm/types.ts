import { RootNavigationParamsMap } from 'navigations/RootNavigation'

export interface IInitialRouteBlm {
  setInitialRouteName(val: keyof RootNavigationParamsMap): void
}
