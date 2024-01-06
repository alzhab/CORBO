import { ITemplateProps } from '../../../types'

export interface IRepositoryCommands {
  init(params: string[]): Promise<void>
}

export type IReposCreateFileTemplateProps = ITemplateProps & {}
