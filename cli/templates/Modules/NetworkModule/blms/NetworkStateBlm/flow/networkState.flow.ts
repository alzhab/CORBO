import { inject, injectable } from 'inversify'
import { IFlowReactions } from 'base/root-flow'
import { RootNavigationParamsMap } from 'navigations/RootNavigation'
import {
  ENetworkStateFlowEvents,
  INetworkStateFlow,
  INetworkStateFlowData,
} from './types'
import {
  IMockRequestStatusesActions,
  MockRequestStatusesActionsId,
} from '../actions'

export const NetworkStateFlowId = Symbol.for('NetworkStateFlow')

@injectable()
export class NetworkStateFlow implements INetworkStateFlow {
  constructor(
    @inject(MockRequestStatusesActionsId)
    private mockRequestStatusesActions: IMockRequestStatusesActions,
  ) {}

  get reactions(): IFlowReactions {
    return {
      [ENetworkStateFlowEvents.ON_CHOOSE_MOCK_REQUEST_STATUS]:
        this.onChooseRequestStatus.bind(this),
    }
  }

  get screen(): keyof RootNavigationParamsMap {
    return 'HomeScreen'
  }

  onChooseRequestStatus(
    data: INetworkStateFlowData[ENetworkStateFlowEvents.ON_CHOOSE_MOCK_REQUEST_STATUS],
  ) {
    this.mockRequestStatusesActions.openStatusesDialog(data.buttons)
  }
}
