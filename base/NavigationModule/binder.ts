import { Container } from 'inversify'
import {INavigationService, NavigationService, NavigationServiceId} from './services';
import {IInitialRouteStore, InitialRouteStore, InitialRouteStoreId} from './stores';
import {IInitialRouteBlm, InitialRouteBlm, InitialRouteBlmId} from './blms';

export const bindNavigationModule = (container: Container) => {
  container.bind<INavigationService>(NavigationServiceId).to(NavigationService)
  container.bind<IInitialRouteStore>(InitialRouteStoreId).to(InitialRouteStore)
  container.bind<IInitialRouteBlm>(InitialRouteBlmId).to(InitialRouteBlm)
}
