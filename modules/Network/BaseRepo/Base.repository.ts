import { AxiosInstance, AxiosResponse } from 'axios'
import { inject, injectable } from 'inversify'
import { ContentType, FullRequestParams, IBaseRest } from './types'
import { HttpClientId, IHttpClient } from 'services/HttpClientService'

@injectable()
export class BaseRest implements IBaseRest {
  $http: AxiosInstance
  $mockHttp: AxiosInstance
  secure: string = ''
  
  constructor(@inject(HttpClientId) private httpClient: IHttpClient) {
    this.$http = httpClient.$axios
    this.$mockHttp = httpClient.$mockAxios
  }
  
  getInstance(isMock: boolean | undefined) {
    return isMock ? this.$mockHttp : this.$http
  }
  
  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }
  
  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: any[] = property instanceof Array ? property : [property]
      
      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }
      
      return formData
    }, new FormData())
  }
  
  public request = async <T = any>({
                                     path,
                                     type,
                                     query,
                                     body,
                                     ...params
                                   }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const requestParams = params
    
    if (type === ContentType.FormData && body && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }
    
    if (type === ContentType.Text && body && typeof body !== 'string') {
      body = JSON.stringify(body)
    }
    
    return this.getInstance(params.isMock).request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      data: body,
      url: path,
    })
  }
}
