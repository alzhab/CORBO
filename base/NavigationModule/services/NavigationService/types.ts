import { RefObject } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import { TRoutes } from 'navigations/types'

export interface INavigationService {
  navigation: any
  setNavigation(val: any): void

  navigate<Routes = TRoutes>(
    name: keyof Routes,
    params?: Routes[keyof Routes] | { screen: keyof Routes },
  ): void

  reset<Routes = TRoutes>(
    name: keyof Routes,
    params?: Routes[keyof Routes],
  ): void

  replace<Routes = TRoutes>(
    name: keyof Routes,
    params?: Routes[keyof Routes],
  ): void

  init(navigationRef: RefObject<NavigationContainerRef<TRoutes>>): void

  goBack(): void

  params: any

  canGoBack(): boolean
  currentScreen: undefined | keyof TRoutes
}
