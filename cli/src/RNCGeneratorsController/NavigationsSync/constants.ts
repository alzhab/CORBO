import { ICreateFileInProject } from '../../Base'
import {
  NAVIGATION_FILE,
  NAVIGATION_INDEX,
  NAVIGATION_TYPES,
} from './templates'
import { NavigationConfigParams } from './types'

export const NAVIGATION_CONFIG: (
  data: NavigationConfigParams,
) => ICreateFileInProject[] = (data: NavigationConfigParams) => [
  {
    path: data.folderPath + '/types.ts',
    content: NAVIGATION_TYPES(data),
  },
  {
    path: data.folderPath + '/index.ts',
    content: NAVIGATION_INDEX(data),
  },
  {
    path: data.folderPath + '/' + data.fileName + '.tsx',
    content: NAVIGATION_FILE(data),
  },
]
