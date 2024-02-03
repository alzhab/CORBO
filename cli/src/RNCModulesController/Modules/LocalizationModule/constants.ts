import { ICopyToProject, IInsertoIntoProjectFileParams } from '../../../Base'

export const LOCALIZATION_MODULE_DEPENDENCIES = [
  '@corrbo/module-localization',
]

export const LOCALIZATION_MODULE_TEMPLATE_PATH =
  './templates/Modules/LocalizationModule'

export const LOCALIZATION_MODULE_CONFIG: ICopyToProject[] = [
  {
    pathFrom: LOCALIZATION_MODULE_TEMPLATE_PATH + '/configs/Locales',
    pathTo: '/src/configs/',
    type: 'folder',
  },
]

export const LOCALIZATION_MODULE_BIND: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/binders.ts',
    type: 'before',
    content: "import { bindLocalizationModule, LocalizationStoreId } from '@corrbo/module-localization';\n",
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    content: `  // localizatoin module
  bindLocalizationModule,`,
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    content: `  // localization module
  LocalizationStoreId,`,
    searchRegex: /export const HYDRATED_STORES = \[/,
  },
]
