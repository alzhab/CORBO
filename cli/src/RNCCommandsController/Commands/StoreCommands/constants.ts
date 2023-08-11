import {
  ICreateFileInProject,
  IInsertoIntoProjectFileParams,
} from '../../../Base'
import {
  STORE_FILE_TEMPLATE,
  STORE_INDEX_TEMPLATE,
  STORE_TYPE_TEMPLATE,
} from '../../../../templates/Commands/StoreCommands/constants'
import { ITemplateProps } from '../../../types'

export const STORE_FOLDER_PATH = '/src/BusinessLogic/stores'

export const STORE_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + '/' + data.fileName + '.ts',
    content: STORE_FILE_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/index.ts',
    content: STORE_INDEX_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/types.ts',
    content: STORE_TYPE_TEMPLATE(data),
  },
]

export const STORE_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = ({
  folderName,
  folderPath,
  fileName,
}: ITemplateProps) => [
  {
    path: STORE_FOLDER_PATH + '/' + 'index.ts',
    text: `import { I${folderName}, ${folderName}Id, ${folderName} } from 'stores/${folderName}'\n`,
    type: 'before',
    searchRegex: /function bindStores\(container: Container\) \{/,
  },
  {
    path: STORE_FOLDER_PATH + '/' + 'index.ts',
    text: `container.bind<I${folderName}>(${folderName}Id).to(${folderName})`,
    type: 'after',
    searchRegex: /function bindStores\(container: Container\) \{/,
  },
]
