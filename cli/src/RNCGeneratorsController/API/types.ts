import { TCommandReturn } from '../../types'

export interface IApiGenerator {
  init(): Promise<TCommandReturn>
}

export type TGenericDataReturn = {
  interfaceName: string
  interfaceContent: string
  isCreateType: boolean
  typeIdentifier: 'interface' | 'enum' | 'type'
}

export interface Request {
  path: string
  method: string
  formData: boolean
  pathParams: any
  data: any
  payload: { name: string; optional: boolean; type: string }
}

export interface Response {
  content: any
  status: number
  rawTypeData: any
  typeData: any
  type: string
}

export interface ModelType {
  name: string
  typeData: { content: string }
  typeIdentifier: 'interface' | 'enum' | 'type'
}

export interface ICreateRequestData {
  functionName: string
  path: string
  body: TGenericDataReturn
  query: TGenericDataReturn
  type: string
  requestTemplate: string
  requestTypeTemplate: string
  requestMockTemplates: IRequestMockTemplateConfig
  requestResponse: TGenericDataReturn
}

export interface ICreateMockRequestData {
  path: string
  method: string
  responses: { status: number; data: any }[]
}

export interface IRequestMockTemplateConfig {
  path: string
  routeTemplate: string
  responsesTemplate: { method: string; content: string }
}
