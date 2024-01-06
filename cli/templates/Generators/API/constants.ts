import { ModelType } from '../../../src/RNCGeneratorsController/API'

export const REQUEST_TEMPLATE = (data: {
  path: string
  functionName: string
  method: string
  response: string
  requestDataGeneric: string
}) => {
  return `${data.functionName}(
    data?: TRequestData${
      data.requestDataGeneric ? '<' + data.requestDataGeneric + '>' : ''
    },
  ): Promise<AxiosResponse<${data.response}>> {
    return this.request<${data.response}>({
      path: ${data.path},
      method: '${data.method.toUpperCase()}',
      ...(data || {}),
    })
  }`
}

export const REQUEST_TYPE_TEMPLATE = (data: {
  functionName: string
  response: string
  requestDataGeneric: string
}) => {
  return `${data.functionName}: TRequest<${data.response}${
    data.requestDataGeneric ? ', ' + data.requestDataGeneric : ''
  }>`
}

export const MODEL_TEMPLATE = (data: {
  name: string
  content: string
  type: ModelType['typeIdentifier']
}) => {
  data.content = data.content.replace(/\(|\)/g, '')

  switch (data.type) {
    case 'interface':
      data.content =
        data.content[0] === '{' ? data.content : '{' + data.content + '}'

      return MODEL_INTERFACE_TEMPLATE(data)
    case 'enum':
      data.content =
        data.content[0] === '{' ? data.content : '{' + data.content + '}'

      return MODEL_ENUM_TEMPLATE(data)
    case 'type':
      return MODEL_TYPE_TEMPLATE(data)
  }
}

export const MODEL_INTERFACE_TEMPLATE = (data: {
  name: string
  content: string
}) => `export interface ${data.name} ${data.content}
`
export const MODEL_ENUM_TEMPLATE = (data: {
  name: string
  content: string
}) => `export enum ${data.name} ${data.content}
`

export const MODEL_TYPE_TEMPLATE = (data: {
  name: string
  content: string
}) => `export type ${data.name} = ${data.content}
`
