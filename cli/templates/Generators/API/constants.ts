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

export const MOCK_CONFIG_ROUTE_TEMPLATE = (data: {
  path: string
  response: { status: number; data: any }
  method: string
}) => {
  const routeConf: any = {
    GET: {
      responses: {},
      defaultResponse: 200,
    },
    POST: {
      responses: {},
      defaultResponse: 200,
    },
    PUT: {
      responses: {},
      defaultResponse: 200,
    },
    PATCH: {
      responses: {},
      defaultResponse: 200,
    },
    DELETE: {
      responses: {},
      defaultResponse: 200,
    },
  }

  routeConf[data.method].responses[data.response.status] = data.response.data

  return `'${data.path}': ${JSON.stringify(routeConf, null, 2)},`
}

export const MOCK_CONFIG_RESPONSE_TEMPLATE = (data: {
  response: { status: number; data: any }
}) =>
  `${+data.response.status}: ${JSON.parse(JSON.stringify(data.response.data))}`
