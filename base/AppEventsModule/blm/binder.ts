import { Container } from 'inversify'
import {AppEventsActions, AppEventsActionsId, IAppEventsActions} from './actions';
import {AppEventsStore, AppEventsStoreId, IAppEventsStore} from './store';
import {AppEventsFlow, AppEventsFlowsId, IAppEventsFlow} from './flow';

export const bindAppEventsBlm = (container: Container) => {
  container.bind<IAppEventsActions>(AppEventsActionsId).to(AppEventsActions)
  container.bind<IAppEventsStore>(AppEventsStoreId).to(AppEventsStore)
  container.bind<IAppEventsFlow>(AppEventsFlowsId).to(AppEventsFlow)
}
