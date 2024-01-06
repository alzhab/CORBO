import { ITemplateProps } from '../../../src/types'
import { IReposCreateFileTemplateProps } from '../../../src/RNCCommandsController/Commands/RepositoryCommands'

export const REPOSITORY_FILE_TEMPLATE = (
  data: IReposCreateFileTemplateProps,
) => {
  return `import { injectable } from 'inversify'
import { BaseRest } from 'base/BaseRest'

export const ${data.folderName}Id = Symbol.for('${data.folderName}')

@injectable()
export class ${data.folderName} extends BaseRest implements I${data.folderName} {}
`
}

export const REPOSITORY_INDEX_TEMPLATE = ({
  fileName,
}: ITemplateProps) => `export * from './${fileName}'
export * from './types'
`

export const REPOSITORY_TYPE_TEMPLATE = ({
  folderName,
}: IReposCreateFileTemplateProps) => {
  return `import { IRequestParams } from 'base/BaseRest'
  import * as Modules from 'repositories/types'
  
  export interface I${folderName} {
  }
`
}
