import {Container} from 'inversify';
import {ILocalizationStore, LocalizationStore, LocalizationStoreId} from './store';
import {ILocalization, Localization, LocalizationId} from './services';

export const bindLocalizationModule = (container: Container) => {
  container.bind<ILocalizationStore>(LocalizationStoreId).to(LocalizationStore)
  container.bind<ILocalization>(LocalizationId).to(Localization)
}
