import {
  ICreateFileInProject,
  IInsertoIntoProjectFileParams,
} from '../../../Base'
import {
  BLM_FILE_TEMPLATE,
  BLM_HOOK_TEMPLATE,
  BLM_INDEX_TEMPLATE,
  BLM_TYPE_TEMPLATE,
} from '../../../../templates/Commands/BlmCommands/constants'
import { ITemplateProps } from '../../../types'

export const BLM_FOLDER_PATH = '/src/BusinessLogic/blms'

export const BLM_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + '/' + data.fileName + '.ts',
    content: BLM_FILE_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/index.ts',
    content: BLM_INDEX_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/types.ts',
    content: BLM_TYPE_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/hook.ts',
    content: BLM_HOOK_TEMPLATE(data),
  },
]

export const BLM_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = ({
  folderName,
  folderPath,
  fileName,
}: ITemplateProps) => [
  {
    path: BLM_FOLDER_PATH + '/' + 'index.ts',
    text: `import { I${folderName}, ${folderName}Id, ${folderName} } from 'blms/${folderName}'\n`,
    type: 'before',
    searchRegex: /function bindBlms\(container: Container\) \{/,
  },
  {
    path: BLM_FOLDER_PATH + '/' + 'index.ts',
    text: `container.bind<I${folderName}>(${folderName}Id).to(${folderName})`,
    type: 'after',
    searchRegex: /function bindBlms\(container: Container\) \{/,
  },
]
