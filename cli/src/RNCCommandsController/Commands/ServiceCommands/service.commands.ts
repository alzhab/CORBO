import { inject, injectable } from 'inversify'
import { IServiceCommands } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import {
  SERVICE_BIND_CONFIGURATION,
  SERVICE_CREATE_FILES,
  SERVICE_FOLDER_PATH,
} from './constants'
import chalk from 'chalk'
import shell from 'shelljs'

export const ServiceCommandsId = Symbol('ServiceCommandsId')

@injectable()
export class ServiceCommands implements IServiceCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(): Promise<void> {
    const { fileName, folderName } = await this.validators.getValidName(
      'service',
    )
    const folderPath = SERVICE_FOLDER_PATH + '/' + folderName

    if (this.base.isInProjectExist(folderPath)) {
      console.log(
        chalk.red(`ERROR: SERVICE with name ${folderName} already exist`),
      )
      shell.exit()
    }

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      SERVICE_CREATE_FILES({ fileName, folderPath, folderName }),
    )
    this.base.insertoIntoProjectFile(
      SERVICE_BIND_CONFIGURATION({ fileName, folderPath, folderName }),
    )
  }
}
