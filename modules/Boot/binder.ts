import { Container } from 'inversify'
import {BootStore, BootStoreId, IBootStore} from './stores/BootStore';
import {BootBlm, BootBlmId, IBootBlm} from './blms/BootBlm';

export const bindBootModule = (container: Container) => {
  container.bind<IBootStore>(BootStoreId).to(BootStore)
  container.bind<IBootBlm>(BootBlmId).to(BootBlm)
}
