import { ITemplateProps } from '../../../src/types'

export const BLM_FILE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { injectable } from 'inversify'
import { I${folderName} } from './types'

export const ${folderName}Id = Symbol.for('${folderName}')

@injectable()
export class ${folderName} implements I${folderName} {
}
`

export const BLM_INDEX_TEMPLATE = ({
  fileName,
}: ITemplateProps) => `export * from './${fileName}'
export * from './types'
export * from './hook'
`

export const BLM_HOOK_TEMPLATE = ({
  folderName,
  fileName,
}: ITemplateProps) => `import { useInjection } from 'inversify-react'
import { ${folderName}Id } from './${fileName}'
import { I${folderName} } from './types'

export function use${folderName}() {
  const blm = useInjection<I${folderName}>(${folderName}Id)

  return {}
}
`

export const BLM_TYPE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `export interface I${folderName} {}
`
