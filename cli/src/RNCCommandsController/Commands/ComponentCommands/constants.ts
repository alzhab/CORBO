import { ICreateFileInProject } from '../../../Base'
import { ITemplateProps } from '../../../types'
import {
  COMPONENT_FILE_TEMPLATE,
  COMPONENT_INDEX_TEMPLATE,
  COMPONENT_TYPE_TEMPLATE,
} from './templates'

export const COMPONENT_FOLDER_PATH = '/src/ui/components'

export const COMPONENT_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = data => [
  {
    path: data.folderPath + '/' + data.fileName + '.tsx',
    content: COMPONENT_FILE_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/index.ts',
    content: COMPONENT_INDEX_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/types.ts',
    content: COMPONENT_TYPE_TEMPLATE(data),
  },
]
