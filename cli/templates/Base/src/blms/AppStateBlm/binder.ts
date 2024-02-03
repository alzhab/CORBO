import { Container } from 'inversify'
import { InitialRouteActions, InitialRouteActionsId, IInitialRouteActions } from './actions'

import {
  MockRequestStatusesActions,
  MockRequestStatusesActionsId,
  IMockRequestStatusesActions,
} from './actions'

import {
  MockRequestStatusesStore,
  MockRequestStatusesStoreId,
  IMockRequestStatusesStore,
} from './store'

import { IAppState, AppStateFlow, AppStateFlowId } from './flow'

export const bindAppStateBlm = (container: Container) => {
  container.bind<IInitialRouteActions>(InitialRouteActionsId).to(InitialRouteActions)
  container
    .bind<IMockRequestStatusesActions>(MockRequestStatusesActionsId)
    .to(MockRequestStatusesActions)
  container.bind<IAppStateStore>(MockRequestStatusesStoreId).to(MockRequestStatusesStore)
  container.bind<IAppState>(AppStateFlowId).to(AppStateFlow)
}
