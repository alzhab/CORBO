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
  async init(params: string[]): Promise<void> {
    if (params[0]) {
      const names = params[0].split(',')
      return Promise.all(names.map(this.createStore.bind(this))).then()
    } else {
      return this.createStore()
    }
  }

  async createStore(name?: string) {
    const { fileName, folderName } = await this.validators.getValidName(
      'store',
      name,
    )
    const folderPath = STORE_FOLDER_PATH + '/' + folderName

    if (this.base.isInProjectExist(folderPath)) {
      console.log(
        chalk.red(`ERROR: STORE with name ${folderName} already exist`),
      )
      return
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
