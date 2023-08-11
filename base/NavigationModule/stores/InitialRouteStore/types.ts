import { RootNavigationParamsMap } from 'navigations/RootNavigation'

export interface IInitialRouteStore {
  initialScreen: keyof RootNavigationParamsMap | null
  setInitialScreen(val: keyof RootNavigationParamsMap): void
}
