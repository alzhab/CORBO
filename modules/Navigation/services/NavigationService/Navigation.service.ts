import { injectable } from 'inversify'
import { RefObject } from 'react'
import {
  CommonActions,
  NavigationContainerRef,
  NavigationProp,
  StackActions,
} from '@react-navigation/native'
import { INavigationService } from './types'
import { TRoutes } from 'navigations/types'

export const NavigationServiceId = Symbol.for('INavigationService')

@injectable()
export class NavigationService implements INavigationService {
  private _navigationRef?: RefObject<NavigationContainerRef<TRoutes>>
  private _navigation?: NavigationProp<TRoutes>

  get navigation() {
    return this._navigation
  }

  setNavigation(val: any): void {
    this._navigation = val
  }

  init(navigationRef: RefObject<NavigationContainerRef<TRoutes>>) {
    this._navigationRef = navigationRef
  }

  navigate<RouteName extends keyof TRoutes>(
    name: RouteName,
    params?: TRoutes[RouteName] | { screen: RouteName },
  ) {
    if (this._navigationRef && this._navigationRef.current) {
      this._navigationRef.current.navigate(name as any, params as any)
    }
  }

  goBack() {
    if (this._navigationRef && this._navigationRef.current) {
      if (this._navigationRef.current.canGoBack()) {
        this._navigationRef.current.goBack()
      }
    }
  }

  canGoBack(): boolean {
    if (this._navigationRef && this._navigationRef.current) {
      return this._navigationRef.current.canGoBack()
    } else {
      return false
    }
  }

  reset<RouteName extends keyof TRoutes>(
    name: RouteName,
    params?: TRoutes[RouteName],
  ) {
    if (this._navigationRef && this._navigationRef.current) {
      this._navigationRef.current.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name, params }],
        }),
      )
    }
  }

  replace<RouteName extends keyof TRoutes>(
    name: RouteName,
    params?: TRoutes[RouteName],
  ) {
    if (this._navigationRef && this._navigationRef.current) {
      this._navigationRef.current.dispatch(StackActions.replace(name, params))
    }
  }

  get params() {
    return this._navigationRef?.current?.getCurrentRoute()?.params || {}
  }

  get currentScreen() {
    return this._navigationRef?.current?.getState().routes[0]
      .name as keyof TRoutes
  }
  
  pop(): void {
    if (this._navigationRef && this._navigationRef.current) {
      this._navigationRef.current.dispatch(
        StackActions.pop()
      )
    }
  }
}
