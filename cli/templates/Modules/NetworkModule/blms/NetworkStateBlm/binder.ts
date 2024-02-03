import { Container } from 'inversify'

import {
  IMockRequestStatusesActions,
  MockRequestStatusesActions,
  MockRequestStatusesActionsId,
} from './actions'

import {
  IMockRequestStatusesStore,
  MockRequestStatusesStore,
  MockRequestStatusesStoreId,
} from './store'

import { INetworkStateFlow, NetworkStateFlow, NetworkStateFlowId } from './flow'

export const bindNetworkStateBlm = (container: Container) => {
  container
    .bind<IMockRequestStatusesActions>(MockRequestStatusesActionsId)
    .to(MockRequestStatusesActions)
  container
    .bind<IMockRequestStatusesStore>(MockRequestStatusesStoreId)
    .to(MockRequestStatusesStore)
  container.bind<INetworkStateFlow>(NetworkStateFlowId).to(NetworkStateFlow)
}
