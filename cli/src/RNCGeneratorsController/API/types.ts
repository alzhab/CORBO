export interface IApiGenerator {
  init(): Promise<void[]>
}

export interface IEndpoint {
  name: string
  comment: string
  url: string
  methodType: 'get' | 'post' | 'put' | 'patch' | 'delete'
  params: {
    body?: IEndpointParam
    query: IEndpointParam[]
    path: IEndpointParam[]
  }
  responseInterface?: string
}

export interface IEndpointParam {
  name: string
  required: boolean
  paramType: 'body' | 'query' | 'path'
  type?: string
  interface?: string
}

export interface IMethod {
  get: IMethodDesc
  post: IMethodDesc
  put: IMethodDesc
  patch: IMethodDesc
  delete: IMethodDesc
  parameters: IMethodDescParameter[]
}

export interface IMethodDesc {
  operationId: string
  description: string
  parameters: IMethodDescParameter[]
  responses: {
    '200'?: IMethodDescResponse
  }
  tags: [string]
}

export interface IMethodDescParameter {
  name: string
  in: 'body' | 'query' | 'path'
  required: boolean
  type?: string
  schema?: IMethodDescSchema
}

export interface IMethodDescResponse {
  description: string
  schema: IMethodDescSchema
}

export interface IMethodDescSchema {
  $ref: string
}

export interface IDefinition {
  description: string
  required: string[]
  type: string
  properties: { [key: string]: IDefinitionProperty }
}

export interface IDefinitionProperty {
  title: string
  type: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object'
  format: string
  enum: string[]
  $ref: string
  additionalProperties: { [key: string]: IDefinitionProperty }
  items: IDefinitionProperty
}

export interface IModule {
  name: string
  description: string
  properties: IModuleProperty[]
}

export interface IModuleProperty {
  name: string
  type: any
  interface?: string
  required?: boolean
}

