import { ITemplateProps } from '../../../types'

export interface IRepositoryCommands {
  init(): Promise<void>
}

export type IReposCreateFileTemplateProps = ITemplateProps & {}
