import { ITemplateProps } from '../../../src/types'

export const BINDER_FILE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { Container } from 'inversify'

export const bind${folderName} = (container: Container) => {
}
`

export const BLM_INDEX_TEMPLATE = () => `export * from './actions'
export * from './flow'
export * from './store'
export * from './ui-adapters'
export * from './binder'
`

export const ACTION_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { injectable } from 'inversify'
import { I${folderName} } from './types'

export const ${folderName}Id = Symbol.for('${folderName}')

@injectable()
export class ${folderName} implements I${folderName} {}
`

export const TYPES_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `export interface I${folderName} {}
`

export const FLOW_TYPES_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `export type I${folderName} = IBaseFlow & {}

export enum E${folderName}Events {
}

export type I${folderName}Data = {}
`

export const STORE_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { injectable } from 'inversify'
import { I${folderName} } from './types'
import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

export const ${folderName}Id = Symbol.for('${folderName}')

@injectable()
export class ${folderName} implements I${folderName} {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, { name: '${folderName}', properties: [] })
  }
}
`

export const UI_ADAPTER_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { useInjection } from 'inversify-react'
import { useCallback, useMemo } from 'react'

export function use${folderName}() {}
`

export const FLOW_TEMPLATE = ({
  folderName,
}: ITemplateProps) => `import { inject, injectable } from 'inversify'
import { IFlowReactions } from 'base/root-flow'
import { I${folderName} } from './types'

export const ${folderName}Id = Symbol.for('${folderName}')

@injectable()
export class ${folderName} implements I${folderName} {
  get reactions(): IFlowReactions {
    return {}
  }
}
`
