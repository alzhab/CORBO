import { inject, injectable } from 'inversify'
import { IScreenCommands } from './types'
import { BaseId, IBase } from '../../../Base'
import { IValidators, ValidatorsId } from '../../../Validators'
import { SCREEN_CONFIG, SCREEN_FOLDER_PATH } from './constants'

export const ScreenCommandsId = Symbol.for('ScreenCommandsId')

@injectable()
export class ScreenCommands implements IScreenCommands {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}

  async init(params: string[]): Promise<void> {
    if (params[0]) {
      const names = params[0].split(',')
      return Promise.all(names.map(this.createScreen.bind(this))).then()
    } else {
      return this.createScreen()
    }
  }

  async createScreen(param?: string) {
    const { folderName, fileName, folderPath } =
      await this.validators.getValidName({
        suffix: 'screen',
        name: param,
        folderPath: SCREEN_FOLDER_PATH,
      })

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      SCREEN_CONFIG({ fileName, folderName, folderPath }),
    )
  }
}
