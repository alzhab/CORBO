import {
  ICreateFileInProject,
  IInsertoIntoProjectFileParams,
} from '../../../Base'
import {
  ACTION_TEMPLATE,
  TYPES_TEMPLATE,
  BINDER_FILE_TEMPLATE,
  BLM_INDEX_TEMPLATE,
  STORE_TEMPLATE,
  UI_ADAPTER_TEMPLATE,
  FLOW_TEMPLATE,
  FLOW_TYPES_TEMPLATE,
} from '../../../../templates/Commands/BlmCommands/constants'
import { ITemplateProps } from '../../../types'

export const BLM_FOLDER_PATH = '/src/blm'
export const ROOT_FLOW_PATH = '/src/instruments/base/root-flow'

export const BLM_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + '/binder.ts',
    content: BINDER_FILE_TEMPLATE(data),
  },
  {
    path: data.folderPath + '/index.ts',
    content: BLM_INDEX_TEMPLATE(),
  },
  {
    path: data.folderPath + '/actions/index.ts',
    content: "export * from './types'",
  },
  {
    path: data.folderPath + '/actions/types.ts',
    content: '',
  },
  {
    path: data.folderPath + '/flow/index.ts',
    content: "export * from './types'",
  },
  {
    path: data.folderPath + '/flow/types.ts',
    content: "import { IBaseFlow } from 'base/root-flow'",
  },
  {
    path: data.folderPath + '/store/index.ts',
    content: "export * from './types'",
  },
  {
    path: data.folderPath + '/store/types.ts',
    content: '',
  },
  {
    path: data.folderPath + '/ui-adapters/index.ts',
    content: '',
  },
]

export const BLM_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = ({ folderName }: ITemplateProps) => [
  {
    path: BLM_FOLDER_PATH + '/' + 'binders.ts',
    content: `import { bind${folderName} } from './${folderName}'`,
    type: 'before',
    searchRegex: /export const BLMS_BINDERS/,
  },
  {
    path: BLM_FOLDER_PATH + '/' + 'binders.ts',
    content: `bind${folderName},`,
    type: 'after',
    searchRegex: /\[/,
  },
]

export const BLM_ACTIONS_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + `/${data.fileName}.ts`,
    content: ACTION_TEMPLATE(data),
  },
]

export const BLM_ACTIONS_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + `/../binder.ts`,
    content: `import {${data.folderName}, ${data.folderName}Id, I${data.folderName}} from './actions';\n`,
    type: 'after',
    searchRegex: new RegExp(/import { Container } from 'inversify'/),
  },
  {
    path: data.folderPath + `/../binder.ts`,
    content: `  container.bind<I${data.folderName}>(${data.folderName}Id).to(${data.folderName})`,
    type: 'after',
    searchRegex: new RegExp(/\(container: Container\) => {/),
  },
  {
    path: data.folderPath + `/types.ts`,
    content: TYPES_TEMPLATE(data),
    type: 'end',
  },
  {
    path: data.folderPath + `/index.ts`,
    content: `export * from './${data.fileName}'`,
    type: 'end',
  },
]

export const BLM_STORE_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + `/${data.fileName}.ts`,
    content: STORE_TEMPLATE(data),
  },
]

export const BLM_STORE_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + `/../binder.ts`,
    content: `import {${data.folderName}, ${data.folderName}Id, I${data.folderName}} from './store';\n`,
    type: 'after',
    searchRegex: new RegExp(/import { Container } from 'inversify'/),
  },
  {
    path: data.folderPath + `/../binder.ts`,
    content: `  container.bind<I${data.folderName}>(${data.folderName}Id).to(${data.folderName})`,
    type: 'after',
    searchRegex: new RegExp(/\(container: Container\) => {/),
  },
  {
    path: data.folderPath + `/types.ts`,
    content: TYPES_TEMPLATE(data),
    type: 'end',
  },
  {
    path: data.folderPath + `/index.ts`,
    content: `export * from './${data.fileName}'`,
    type: 'end',
  },
]

export const UI_ADAPTER_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + `/${data.fileName}.ts`,
    content: UI_ADAPTER_TEMPLATE(data),
  },
]

export const UI_ADAPTER_BIND_CONFIGURATION: (
  data: ITemplateProps,
) => IInsertoIntoProjectFileParams[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + `/index.ts`,
    content: `export * from './${data.fileName}'`,
    type: 'end',
  },
]

export const FLOW_CREATE_FILES: (
  data: ITemplateProps,
) => ICreateFileInProject[] = (data: ITemplateProps) => [
  {
    path: data.folderPath + `/${data.fileName}.ts`,
    content: FLOW_TEMPLATE(data),
  },
]

export const FLOW_BIND_CONFIGURATION: (
  data: ITemplateProps,
  blmName: string,
) => IInsertoIntoProjectFileParams[] = (data: ITemplateProps, blmName) => [
  {
    path: data.folderPath + `/index.ts`,
    content: `export * from './${data.fileName}'`,
    type: 'end',
  },
  {
    path: data.folderPath + `/types.ts`,
    content: FLOW_TYPES_TEMPLATE(data),
    type: 'end',
  },
  {
    path: data.folderPath + `/../binder.ts`,
    content: `import {${data.folderName}, ${data.folderName}Id, I${data.folderName}} from './flow';\n`,
    type: 'after',
    searchRegex: new RegExp(/import { Container } from 'inversify'/),
  },
  {
    path: data.folderPath + `/../binder.ts`,
    content: `  container.bind<I${data.folderName}>(${data.folderName}Id).to(${data.folderName})`,
    type: 'after',
    searchRegex: new RegExp(/\(container: Container\) => {/),
  },
  {
    path: ROOT_FLOW_PATH + `/types.ts`,
    content: `import { E${data.folderName}Events, I${data.folderName}Data } from 'blms/${blmName}'`,
    type: 'before',
    searchRegex: new RegExp(/export interface IBaseFlow {/),
  },
  {
    path: ROOT_FLOW_PATH + `/types.ts`,
    content: `E${data.folderName}Events & `,
    type: 'after',
    searchRegex: new RegExp(/export type EFlowEvents = /),
  },
  {
    path: ROOT_FLOW_PATH + `/types.ts`,
    content: `...E${data.folderName}Events,`,
    type: 'after',
    searchRegex: new RegExp(/export const EFlowEvents = {/),
  },
  {
    path: ROOT_FLOW_PATH + `/types.ts`,
    content: `I${data.folderName}Data &`,
    type: 'after',
    searchRegex: new RegExp(/export type IFlowReactionsData = /),
  },
  {
    path: ROOT_FLOW_PATH + `/root-flow.ts`,
    content: `import { I${data.folderName}, ${data.folderName}Id } from 'blms/${blmName}'`,
    type: 'before',
    searchRegex: new RegExp(
      /export const RootFlowId = Symbol.for\('RootFlow'\)/,
    ),
  },
  {
    path: ROOT_FLOW_PATH + `/root-flow.ts`,
    content: `@inject(${data.folderName}Id) private ${data.folderName}: I${data.folderName},`,
    type: 'after',
    searchRegex: new RegExp(
      /@inject\(AppEventsFlowsId\) private appEvents: IAppEventsFlow,/,
    ),
  },
  {
    path: ROOT_FLOW_PATH + `/root-flow.ts`,
    content: `...this.${data.folderName}.reactions,`,
    type: 'after',
    searchRegex: new RegExp(/...this.appEvents.reactions,/),
  },
]
