import {IBaseFlow} from 'base/root-flow';

export type IAppState = IBaseFlow & {}

export enum EAppStateFlowEvents {
  ON_APP_OPEN = 'ON_APP_OPEN',
}

export type IAppStateFlowData = {
  [EAppStateFlowEvents.ON_APP_OPEN]: undefined
}
