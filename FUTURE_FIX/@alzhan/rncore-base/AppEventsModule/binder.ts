import { Container } from 'inversify'
import { AppEventsBlm, AppEventsBlmId, IAppEventsBlm } from './blm'
import { AppEventsStore, AppEventsStoreId, IAppEventsStore } from './store'

export const bindAppEventsModule = (container: Container) => {
  container.bind<IAppEventsBlm>(AppEventsBlmId).to(AppEventsBlm)
  container.bind<IAppEventsStore>(AppEventsStoreId).to(AppEventsStore)
}
