import { StackNavigationProp } from '@react-navigation/stack'
import { RootNavigationParamsMap } from './RootNavigation'

export type RoutesNavigationProp = StackNavigationProp<TRoutes>
export type TRoutes = RootNavigationParamsMap
