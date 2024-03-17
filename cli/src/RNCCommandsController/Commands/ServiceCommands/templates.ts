import { ITemplateProps } from '../../../types'

export const SERVICE_FILE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { injectable } from 'inversify'
import { I${folderName} } from './types'

export const ${folderName}Id = Symbol.for('${folderName}')

@injectable()
export class ${folderName} implements I${folderName} {}
`

export const SERVICE_INDEX_TEMPLATE = ({
  fileName,
}: ITemplateProps) => `export * from './${fileName}'
export * from './types'
`

export const SERVICE_TYPE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `export interface I${folderName} {}
`
