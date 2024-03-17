import { bindServices } from 'services/index'
import { bindRepositories } from 'repositories/index'
import { BLMS_BINDERS } from './blms/binders'
import { Container } from 'inversify'
import { LOCAL_STORAGE_SERVICE_BINDERS } from '@corrbo/module-localstorage/binders'
import { NAVIGATION_MODULE_BINDERS } from '@corrbo/module-navigation/binders'

export const BINDERS: ((container: Container) => void)[] = [
  // modules-Base
  ...LOCAL_STORAGE_SERVICE_BINDERS,
  ...NAVIGATION_MODULE_BINDERS,
  // app
  ...BLMS_BINDERS,
  bindServices,
  bindRepositories,
]
