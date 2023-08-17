import { ITemplateProps } from '../../../src/types'
import { IReposCreateFileTemplateProps } from '../../../src/RNCCommandsController/Commands/RepositoryCommands'
import { IEndpoint, IModule } from '../../../src/RNCGeneratorsController/API'

export const REPOSITORY_FILE_TEMPLATE = (
  data: IReposCreateFileTemplateProps,
) => {
  const modulesImports = data.endpoints
    .map(METHOD_TEMPLATE_FUNCTION_IMPORTS_MODULES)
    .filter(item => !!item)

  return `import { injectable } from 'inversify'
import { BaseRest } from 'base/BaseRest'
import { I${data.folderName},
  ${data.endpoints.map(METHOD_TEMPLATE_FUNCTION_IMPORTS_PARAMS).join(',\n')}
 } from './types'
${
  modulesImports.length
    ? `import {
  ${modulesImports.join(',\n')}
 } from '../types'`
    : ''
}

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
  return `import { IRequestParams } from '../base/types'
  export interface I${folderName} {
  ${endpoints.map(METHOD_TEMPLATE_INTERFACE_PARAM).join('\n')}
  }
  
  ${endpoints.map(METHOD_TEMPLATE_INTERFACE_PARAMS_TYPE).join('\n')}
`
}

export const METHOD_TEMPLATE_FUNCTION_IMPORTS_PARAMS = (endpoint: IEndpoint) =>
  `I${endpoint.name}Params`

export const METHOD_TEMPLATE_FUNCTION_IMPORTS_MODULES = (endpoint: IEndpoint) =>
  `${endpoint.responseInterface || ''}`

export const METHOD_TEMPLATE_FUNCTION = (endpoint: IEndpoint) => `
// ${endpoint.comment}
${endpoint.name}({path, query, body}: I${endpoint.name}Params) {
    return this.request<${endpoint.responseInterface || 'void'}>({
      url: \`${endpoint.url}\`,
      type: '${endpoint.methodType}',
      body,
      params: {
        params: query
      }
    })
  }`

export const METHOD_TEMPLATE_INTERFACE_PARAM = (endpoint: IEndpoint) => {
  return `${endpoint.name}(params: I${endpoint.name}Params): Promise<${endpoint.responseInterface}>`
}

export const METHOD_TEMPLATE_INTERFACE_PARAMS_TYPE = (endpoint: IEndpoint) => {
  const { path, body, query } = endpoint.params

  const params = [
    path.map(item => `{${item.name}${item.required ? '' : '?'}: ${item.type}}`),
    query.map(
      item => `{${item.name}${item.required ? '' : '?'}: ${item.type}}`,
    ),
    body?.interface,
  ]

  return params.length
    ? `export type I${endpoint.name}Params = undefined`
    : `export type I${endpoint.name}Params = IRequestParams<${params.join(
        ', ',
      )}>`
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
