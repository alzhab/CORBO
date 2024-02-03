import { Container } from 'inversify'
import {ILocalStorageClient} from './LocalClientService/types';
import {LocalStorageClient, LocalStorageClientId} from './LocalClientService/LocalClient.service';


export const bindLocalStorageService = (container: Container) => {
  container
    .bind<ILocalStorageClient>(LocalStorageClientId)
    .to(LocalStorageClient)
  container.get<ILocalStorageClient>(LocalStorageClientId).initPersistable()
}
