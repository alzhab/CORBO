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

export const RepositoryCommandsId = Symbol.for('RepositoryCommands')

@injectable()
export class RepositoryCommands implements IRepositoryCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(): Promise<void> {
    const { fileName, folderName } = await this.validators.getValidName('repo')
    const folderPath = REPOSITORY_FOLDER_PATH + '/' + folderName

    if (this.base.isInProjectExist(folderPath)) {
      console.log(
        chalk.red(`ERROR: REPOSITORY with name ${folderName} already exist`),
      )
      shell.exit()
    }

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      REPOSITORY_CREATE_FILES({ fileName, folderPath, folderName }),
    )
    this.base.insertoIntoProjectFile(
      REPOSITORY_BIND_CONFIGURATION({ fileName, folderPath, folderName }),
    )
  }
}
