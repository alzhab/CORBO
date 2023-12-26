import { bindRootFlow } from 'base/root-flow'
import { bindServices } from 'services/index'
import { bindRepositories } from 'repositories/index'
import { LOCAL_STORAGE_SERVICE_BINDERS } from '@corrbo/base/LocalStorageModule'
import { NAVIGATION_MODULE_BINDERS } from '@corrbo/base/NavigationModule'
import { APP_EVENTS_BINDERS } from '@corrbo/base/AppEventsModule'
import { BLMS_BINDERS } from './blms/binders'
import { Container } from 'inversify'

export const BINDERS: ((container: Container) => void)[] = [
  // modules-base
  ...APP_EVENTS_BINDERS,
  ...LOCAL_STORAGE_SERVICE_BINDERS,
  ...NAVIGATION_MODULE_BINDERS,
  // app
  ...BLMS_BINDERS,
  bindRootFlow,
  bindServices,
  bindRepositories,
]
