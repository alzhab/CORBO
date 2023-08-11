import { Container } from 'inversify'
import {
  ILocalStorageClient,
  LocalStorageClient,
  LocalStorageClientId,
} from './service'

export const bindLocalStorageModule = (container: Container) => {
  container
    .bind<ILocalStorageClient>(LocalStorageClientId)
    .to(LocalStorageClient)
  container.get<ILocalStorageClient>(LocalStorageClientId).initPersistable()
}
