import { RefObject } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import { TRoutes } from 'navigations/types'

export interface INavigationService {
  navigation: any
  setNavigation(val: any): void

  navigate<RouteName extends keyof TRoutes>(
    name: RouteName,
    params?: TRoutes[RouteName] | { screen: RouteName },
  ): void

  reset<RouteName extends keyof TRoutes>(
    name: RouteName,
    params?: TRoutes[RouteName],
  ): void

  replace<RouteName extends keyof TRoutes>(
    name: RouteName,
    params?: TRoutes[RouteName],
  ): void

  init(navigationRef: RefObject<NavigationContainerRef<TRoutes>>): void

  goBack(): void

  params: any

  canGoBack(): boolean
  currentScreen: undefined | keyof TRoutes
}
