import { IBaseFlow } from 'base/root-flow'
import { IStatusButton } from 'blm/NetworkStateBlm/store/types'

export type INetworkStateFlow = IBaseFlow & {}

export enum ENetworkStateFlowEvents {
  ON_CHOOSE_MOCK_REQUEST_STATUS = 'ON_CHOOSE_MOCK_REQUEST_STATUS',
}

export type INetworkStateFlowData = {
  [ENetworkStateFlowEvents.ON_CHOOSE_MOCK_REQUEST_STATUS]: {
    buttons: IStatusButton[]
  }
}
