import { injectable } from 'inversify'
import { RefObject } from 'react'
import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native'
import { INavigationService } from './types'
import { TRoutes } from 'navigations/types'
import { NavigationProp } from '@react-navigation/core/lib/typescript/src/types'

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

  navigate<Routes = TRoutes>(
    name: keyof Routes,
    params?: Routes[keyof Routes] | { screen: keyof Routes },
  ) {
    if (this._navigationRef && this._navigationRef.current) {
      this._navigationRef.current.navigate(name, params)
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

  reset<Routes = TRoutes>(
    name: keyof Routes,
    params?: Routes[keyof Routes],
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

  replace<Routes = TRoutes>(
    name: keyof Routes,
    params?: Routes[keyof Routes],
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
}
