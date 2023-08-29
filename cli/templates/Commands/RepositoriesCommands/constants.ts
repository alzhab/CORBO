import { ITemplateProps } from '../../../src/types'
import { IReposCreateFileTemplateProps } from '../../../src/RNCCommandsController/Commands/RepositoryCommands'
import { IEndpoint, IModule } from '../../../src/RNCGeneratorsController/API'

export const REPOSITORY_FILE_TEMPLATE = (
  data: IReposCreateFileTemplateProps,
) => {
  return `import { injectable } from 'inversify'
import { BaseRest } from 'base/BaseRest'
import { I${data.folderName},
  ${data.endpoints.map(METHOD_PARAM).join(',\n')}
 } from './types'
  import * as Modules from 'repositories/types'

export const ${data.folderName}Id = Symbol.for('${data.folderName}')

@injectable()
export class ${data.folderName} extends BaseRest implements I${
    data.folderName
  } {
  ${data.endpoints.map(METHOD_TEMPLATE_FUNCTION).join('\n')}
}
`
}

export const REPOSITORY_INDEX_TEMPLATE = ({
  fileName,
}: ITemplateProps) => `export * from './${fileName}'
export * from './types'
`

export const REPOSITORY_TYPE_TEMPLATE = ({
  folderName,
  endpoints,
}: IReposCreateFileTemplateProps) => {
  return `import { IRequestParams } from 'base/BaseRest'
  import * as Modules from 'repositories/types'
  
  export interface I${folderName} {
  ${endpoints.map(METHOD_TEMPLATE_INTERFACE_PARAM).join('\n')}
  }
  
  ${endpoints.map(METHOD_TEMPLATE_INTERFACE_PARAMS_TYPE).join('\n')}
`
}

export const METHOD_PARAM = (endpoint: IEndpoint) =>
  `I${endpoint.name.replace(/\s+(.)/g, function (match, group) {
    return group.toUpperCase()
  })}Params`

export const METHOD_TEMPLATE_FUNCTION = (endpoint: IEndpoint) => `
/* ${endpoint.comment} */
${endpoint.name}({path, query, body}: ${METHOD_PARAM(endpoint)} {
    return this.request<${
      GET_INTERFACE(endpoint.responseInterface) || 'void'
    }>({
      url: \`${endpoint.url}\`,
      type: '${endpoint.methodType}',
      body,
      params: {
        params: query
      }
    })
  }`

export const METHOD_TEMPLATE_INTERFACE_PARAM = (endpoint: IEndpoint) => {
  return `${endpoint.name}(params: ${METHOD_PARAM(endpoint)}): Promise<${
    GET_INTERFACE(endpoint.responseInterface) || 'void'
  }>`
}

export const METHOD_TEMPLATE_INTERFACE_PARAMS_TYPE = (endpoint: IEndpoint) => {
  const { path, body, query } = endpoint.params

  const params = [
    path.length ? `{${path.map(OBJECT)}}` : 'undefined',
    query.length ? `{${query.map(OBJECT)}}` : 'undefined',
    GET_INTERFACE(body?.interface) || 'undefined',
  ]

  return params.length
    ? `export type ${METHOD_PARAM(endpoint)} = IRequestParams<${params.join(
        ',',
      )}>`
    : `export type ${METHOD_PARAM(
        endpoint,
      )} = IRequestParams<undefined, undefined, undefined>`
}

export const MODULE_INTERFACE = (data: IModule) => `export interface ${
  data.name
} {
  ${data.properties
    .map(
      item =>
        `${item.name}${item.required ? '' : '?'}: ${
          item.interface || item.type
        }`,
    )
    .join('\n')}
}`

export const OBJECT = (item: {
  name: string
  required: boolean
  type?: any
  interface?: string
}) => `${item.name}${item.required ? '' : '?'}: ${item.interface || item.type}`

export const GET_INTERFACE = (moduleName?: string) =>
  moduleName ? 'Modules.' + moduleName : ''
