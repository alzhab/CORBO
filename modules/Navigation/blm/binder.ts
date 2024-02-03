import { Container } from 'inversify'
import {IInitialRouteStore, InitialRouteStore, InitialRouteStoreId} from './store';
import {IInitialRouteActions, InitialRouteActions, InitialRouteActionsId, } from './actions';

export const bindNavigationBlm = (container: Container) => {
  container.bind<IInitialRouteStore>(InitialRouteStoreId).to(InitialRouteStore)
  container.bind<IInitialRouteActions>(InitialRouteActionsId).to(InitialRouteActions)
}
