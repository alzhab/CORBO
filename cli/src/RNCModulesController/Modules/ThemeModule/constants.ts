import { ICopyToProject, IInsertoIntoProjectFileParams } from '../../../Base'

export const THEME_TEMPLATE_PATH = './templates/Modules/ThemeModule'
export const THEME_DEPENDENCIES = [
  '@corbo/modules/theme',
  'react-native-size-matters',
]

export const THEME_BIND: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/binders.ts',
    type: 'before',
    text: "import { bindThemeModule, ThemeStoreId } from '@corbo/modules/theme';\n",
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    text: `  // theme module
  bindThemeModule,`,
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    text: `  // theme module
  ThemeStoreId,`,
    searchRegex: /export const HYDRATED_STORES = \[/,
  },
]

export const THEME_COPY: ICopyToProject[] = [
  {
    pathFrom: THEME_TEMPLATE_PATH + '/Theme',
    pathTo: '/src/Configs/',
  },
  {
    pathFrom: THEME_TEMPLATE_PATH + '/react-native.config.js',
    pathTo: '/',
    type: 'file',
  },
]
