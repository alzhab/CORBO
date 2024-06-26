import {
  ICreateFileInProject,
  IInsertoIntoProjectFileParams,
} from '../../../Base'
import {
  SERVICE_FILE_TEMPLATE,
  SERVICE_INDEX_TEMPLATE,
  SERVICE_TYPE_TEMPLATE,
} from './templates'
import { ITemplateProps } from '../../../types'

export const SERVICE_FOLDER_PATH = '/src/instruments/services'

export const SERVICE_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + '/' + data.fileName + '.ts',
    content: SERVICE_FILE_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/index.ts',
    content: SERVICE_INDEX_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/types.ts',
    content: SERVICE_TYPE_TEMPLATE(data),
  },
]

export const SERVICE_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = ({
  folderName,
  folderPath,
  fileName,
}: ITemplateProps) => [
  {
    path: SERVICE_FOLDER_PATH + '/' + 'index.ts',
    content: `import { I${folderName}, ${folderName}Id, ${folderName} } from 'services/${folderName}'\n`,
    type: 'before',
    searchRegex: /function bindServices\(container: Container\) \{/,
  },
  {
    path: SERVICE_FOLDER_PATH + '/' + 'index.ts',
    content: `container.bind<I${folderName}>(${folderName}Id).to(${folderName})`,
    type: 'after',
    searchRegex: /function bindServices\(container: Container\) \{/,
  },
]
