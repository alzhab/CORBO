import { ICopyToProject, IInsertoIntoProjectFileParams } from '../../../Base'

export const LOCALIZATION_MODULE_DEPENDENCIES = [
  '@alzhan/rncore-localization-module',
]

export const LOCALIZATION_MODULE_TEMPLATE_PATH =
  './templates/Modules/LocalizationModule'

export const LOCALIZATION_MODULE_CONFIG: ICopyToProject[] = [
  {
    pathFrom: LOCALIZATION_MODULE_TEMPLATE_PATH + '/Configs/Locales',
    pathTo: '/src/Configs/',
    type: 'folder',
  },
]

export const LOCALIZATION_MODULE_BIND: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/binders.ts',
    type: 'before',
    text: "import { bindLocalizationModule, LocalizationStoreId } from '@alzhan/rncore-localization-module';\n",
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    text: `  // localizatoin module
  bindLocalizationModule,`,
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    text: `  // localization module
  LocalizationStoreId,`,
    searchRegex: /export const HYDRATED_STORES = \[/,
  },
]
