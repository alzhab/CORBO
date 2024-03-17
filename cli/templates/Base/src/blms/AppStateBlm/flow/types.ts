import { IBaseFlow } from '@corrbo/base/IOC'

export type IAppState = IBaseFlow & {}

export enum EAppStateFlowEvents {
  ON_APP_OPEN = 'ON_APP_OPEN',
}

export type IAppStateFlowData = {
  [EAppStateFlowEvents.ON_APP_OPEN]: undefined
}
