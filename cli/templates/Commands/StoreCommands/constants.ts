import { ITemplateProps } from '../../../src/types'

export const STORE_FILE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { injectable } from 'inversify'
import { I${folderName} } from './types'

export const ${folderName}Id = Symbol.for('${folderName}')

@injectable()
export class ${folderName} implements I${folderName} {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, { name: '${folderName}', properties: [] })
  }
}
`

export const STORE_INDEX_TEMPLATE = ({
  fileName,
}: ITemplateProps) => `export * from './${fileName}'
export * from './types'
`

export const STORE_TYPE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `export interface I${folderName} {}
`
