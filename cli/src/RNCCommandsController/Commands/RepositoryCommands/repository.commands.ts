import { inject, injectable } from 'inversify'
import { IRepositoryCommands } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import chalk from 'chalk'
import shell from 'shelljs'
import {
  REPOSITORY_BIND_CONFIGURATION,
  REPOSITORY_CREATE_FILES,
  REPOSITORY_FOLDER_PATH,
} from './constant'
import { IEndpoint } from '../../../RNCGeneratorsController/API'

export const RepositoryCommandsId = Symbol.for('RepositoryCommands')

@injectable()
export class RepositoryCommands implements IRepositoryCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(params: string[], endpoints: IEndpoint[] = []): Promise<void> {
    if (params[0]) {
      const names = params[0].split(',')
      return Promise.all(
        names.map(name => this.createRepo(name, endpoints)),
      ).then()
    } else {
      return this.createRepo()
    }
  }

  async createRepo(name?: string, endpoints: IEndpoint[] = []) {
    const { fileName, folderName, folderPath } =
      await this.validators.getValidName({
        suffix: 'repo',
        name,
        folderPath: REPOSITORY_FOLDER_PATH,
      })

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      REPOSITORY_CREATE_FILES({ fileName, folderPath, folderName, endpoints }),
    )
    this.base.insertoIntoProjectFile(
      REPOSITORY_BIND_CONFIGURATION({ fileName, folderPath, folderName }),
    )
  }
}
