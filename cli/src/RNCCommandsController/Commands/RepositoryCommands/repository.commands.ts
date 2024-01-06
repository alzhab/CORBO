import { inject, injectable } from 'inversify'
import { IRepositoryCommands } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import {
  REPOSITORY_BIND_CONFIGURATION,
  REPOSITORY_CREATE_FILES,
  REPOSITORY_FOLDER_PATH,
} from './constant'

export const RepositoryCommandsId = Symbol.for('RepositoryCommands')

@injectable()
export class RepositoryCommands implements IRepositoryCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(params: string[]): Promise<void> {
    if (params[0]) {
      const names = params[0].split(',')
      return Promise.all(names.map(name => this.createRepo(name))).then()
    } else {
      return this.createRepo()
    }
  }

  async createRepo(name?: string) {
    const { fileName, folderName, folderPath } =
      await this.validators.getValidName({
        suffix: 'repo',
        name,
        folderPath: REPOSITORY_FOLDER_PATH,
      })

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      REPOSITORY_CREATE_FILES({ fileName, folderPath, folderName }),
    )
    this.base.insertoIntoProjectFile(
      REPOSITORY_BIND_CONFIGURATION({ fileName, folderPath, folderName }),
    )
  }
}
