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
  async init(params: string[]): Promise<void> {
    if (params[0]) {
      const names = params[0].split(',')
      return Promise.all(names.map(this.createService.bind(this))).then()
    } else {
      return this.createService()
    }
  }

  async createService(name?: string) {
    const { fileName, folderName, folderPath } =
      await this.validators.getValidName({
        suffix: 'service',
        name,
        folderPath: SERVICE_FOLDER_PATH,
      })

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      SERVICE_CREATE_FILES({ fileName, folderPath, folderName }),
    )
    this.base.insertoIntoProjectFile(
      SERVICE_BIND_CONFIGURATION({ fileName, folderPath, folderName }),
    )
  }
}
