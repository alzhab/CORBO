import {Container} from 'inversify';
import {ILocalizationStore, LocalizationStore, LocalizationStoreId} from './store';

export const bindLocalizationModule = (container: Container) => {
  container.bind<ILocalizationStore>(LocalizationStoreId).to(LocalizationStore)
}
