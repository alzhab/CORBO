import { inject, injectable } from 'inversify'
import { IBlmCommands } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import {
  BLM_BIND_CONFIGURATION,
  BLM_CREATE_FILES,
  BLM_FOLDER_PATH,
} from './constants'
import chalk from 'chalk'
import shell from 'shelljs'

export const BlmCommandsId = Symbol('BlmCommandsId')

@injectable()
export class BlmCommands implements IBlmCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(): Promise<void> {
    const { fileName, folderName } = await this.validators.getValidName('blm')
    const folderPath = BLM_FOLDER_PATH + '/' + folderName

    if (this.base.isInProjectExist(folderPath)) {
      console.log(chalk.red(`ERROR: BLM with name ${folderName} already exist`))
      shell.exit()
    }

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      BLM_CREATE_FILES({ fileName, folderPath, folderName }),
    )
    this.base.insertoIntoProjectFile(
      BLM_BIND_CONFIGURATION({ fileName, folderPath, folderName }),
    )
  }
}
