import { IEndpoint } from '../../../RNCGeneratorsController/API'
import { ITemplateProps } from '../../../types'

export interface IRepositoryCommands {
  init(params: string[], endpoints: IEndpoint[]): Promise<void>
}

export type IReposCreateFileTemplateProps = ITemplateProps & {
  endpoints: IEndpoint[]
}
