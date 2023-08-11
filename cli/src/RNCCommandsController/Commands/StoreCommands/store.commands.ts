import { inject, injectable } from 'inversify'
import { IStoreCommands } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import {
  STORE_BIND_CONFIGURATION,
  STORE_CREATE_FILES,
  STORE_FOLDER_PATH,
} from './constants'
import chalk from 'chalk'
import shell from 'shelljs'

export const StoreCommandsId = Symbol('StoreCommandsId')

@injectable()
export class StoreCommands implements IStoreCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(): Promise<void> {
    const { fileName, folderName } = await this.validators.getValidName('store')
    const folderPath = STORE_FOLDER_PATH + '/' + folderName

    if (this.base.isInProjectExist(folderPath)) {
      console.log(
        chalk.red(`ERROR: STORE with name ${folderName} already exist`),
      )
      shell.exit()
    }

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      STORE_CREATE_FILES({ fileName, folderPath, folderName }),
    )
    this.base.insertoIntoProjectFile(
      STORE_BIND_CONFIGURATION({ fileName, folderPath, folderName }),
    )
  }
}
