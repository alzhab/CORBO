import bindAppFlow from 'flow/index';
import bindServices from 'services/index';
import bindStores from 'stores/index';
import bindBlms from 'blms/index';
import bindRepositories from 'repositories/index';
import { bindAppEventsModule } from '@corbo/base/AppEventsModule';
import { bindLocalStorageModule } from '@corbo/base/LocalStorageModule';
import { bindNavigationModule } from '@corbo/base/NavigationModule';

export const BINDERS = [
  // modules-base
  bindAppEventsModule,
  bindLocalStorageModule,
  bindNavigationModule,
  // app
  bindAppFlow,
  bindServices,
  bindStores,
  bindBlms,
  bindRepositories,
];

export const HYDRATED_STORES = [];
