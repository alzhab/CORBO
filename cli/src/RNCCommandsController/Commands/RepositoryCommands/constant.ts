import {
  ICreateFileInProject,
  IInsertoIntoProjectFileParams,
} from '../../../Base'
import {
  REPOSITORY_FILE_TEMPLATE,
  REPOSITORY_INDEX_TEMPLATE,
  REPOSITORY_TYPE_TEMPLATE,
} from '../../../../templates/Commands/RepositoriesCommands/constants'
import { ITemplateProps } from '../../../types'
import { IReposCreateFileTemplateProps } from './types'

export const REPOSITORY_FOLDER_PATH = '/src/Instruments/repositories'

export const REPOSITORY_CREATE_FILES: (
  data: IReposCreateFileTemplateProps,
) => ICreateFileInProject[] = data => [
  {
    path: data.folderPath + '/' + data.fileName + '.ts',
    content: REPOSITORY_FILE_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/index.ts',
    content: REPOSITORY_INDEX_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/types.ts',
    content: REPOSITORY_TYPE_TEMPLATE(data),
  },
]

export const REPOSITORY_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = ({
  folderName,
  folderPath,
  fileName,
}) => [
  {
    path: REPOSITORY_FOLDER_PATH + '/' + 'index.ts',
    text: `import { I${folderName}, ${folderName}Id, ${folderName} } from 'repositories/${folderName}'\n`,
    type: 'before',
    searchRegex: /function bindRepositories\(container: Container\) \{/,
  },
  {
    path: REPOSITORY_FOLDER_PATH + '/' + 'index.ts',
    text: `container.bind<I${folderName}>(${folderName}Id).to(${folderName})`,
    type: 'after',
    searchRegex: /function bindRepositories\(container: Container\) \{/,
  },
]
