import { ICopyToProject, IInsertoIntoProjectFileParams } from '../../../Base'

export const THEME_TEMPLATE_PATH = './templates/Modules/ThemeModule'
export const THEME_DEPENDENCIES = [
  '@corrbo/module-theme',
  'react-native-size-matters',
]

export const THEME_BIND: IInsertoIntoProjectFileParams[] = [
  {
    path: '/src/binders.ts',
    type: 'before',
    content: "import { bindThemeModule, ThemeStoreId } from '@corrbo/modules/theme';\n",
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    content: `  // theme module
  bindThemeModule,`,
    searchRegex: /export const BINDERS = \[/,
  },
  {
    path: '/src/binders.ts',
    type: 'after',
    content: `  // theme module
  ThemeStoreId,`,
    searchRegex: /export const HYDRATED_STORES = \[/,
  },
]

export const THEME_COPY: ICopyToProject[] = [
  {
    pathFrom: THEME_TEMPLATE_PATH + '/Theme',
    pathTo: '/src/configs/',
  },
  {
    pathFrom: THEME_TEMPLATE_PATH + '/react-native.config.js',
    pathTo: '/',
    type: 'file',
  },
]
