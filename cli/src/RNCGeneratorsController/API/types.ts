export interface IApiGenerator {
  init(): Promise<void>
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

export interface ModelType {
  name: string
  typeData: { content: string }
  typeIdentifier: 'interface' | 'enum' | 'type'
}

export interface ICreateRequestData {
  response: TGenericDataReturn
  body: TGenericDataReturn
  query: TGenericDataReturn
  type: string
  requestTemplate: string
  requestTypeTemplate: string
}
