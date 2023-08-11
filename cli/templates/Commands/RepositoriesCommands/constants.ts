import { ITemplateProps } from '../../../src/types'

export const REPOSITORY_FILE_TEMPLATE = (
  data: ITemplateProps,
) => `import { injectable } from 'inversify'
import { BaseRest } from 'base/BaseRest'
import { I${data.folderName} } from './types'

export const ${data.folderName}Id = Symbol.for('${data.folderName}')

@injectable()
export class ${data.folderName} extends BaseRest implements I${data.folderName} {}
`

export const REPOSITORY_INDEX_TEMPLATE = ({
  fileName,
}: ITemplateProps) => `export * from './${fileName}'
export * from './types'
`

export const REPOSITORY_TYPE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `export interface I${folderName} {}
`
