import { IValidName } from '../../Validators'

export interface INavigationsSyncGenerator {
  init(): Promise<void>
}

export type INavigation = {
  [key: string]: null | INavigation
}

export type NavigationParam = { isScreen: boolean; path: string; name: string }

export enum NavigationType {
  Stack = 'Stack',
  NativeStack = 'NativeStack',
  Drawer = 'Drawer',
  BottomTabs = 'BottomTabs',
  MaterialBottomTabs = 'MaterialBottomTabs',
  MaterialTopTabs = 'MaterialTopTabs',
}

export type NavigationConfigParams = IValidName & {
  childrens: NavigationParam[]
  type: NavigationType
}
