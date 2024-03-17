import { inject, injectable } from 'inversify'
import { IScreenCommands } from './types'
import { BaseId, IBase } from '../../../Base'
import { IValidators, ValidatorsId } from '../../../Validators'
import { SCREEN_CONFIG, SCREEN_FOLDER_PATH } from './constants'
import minimist from 'minimist'
import inquirer from 'inquirer'
import { ECommands } from '../../types'

export const ScreenCommandsId = Symbol.for('ScreenCommandsId')

@injectable()
export class ScreenCommands implements IScreenCommands {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}

  async init(): Promise<void> {
    const { _: params } = minimist(process.argv.slice(3))

    if (params[0]) {
      const names = params[0].split(',')
      return Promise.all(names.map(this.createScreen.bind(this))).then()
    } else {
      return this.createScreen()
    }
  }

  async createScreen(param?: string) {
    const navigation = await this.chooseNavigation()

    const data = await this.validators.getValidNames({
      suffix: 'screen',
      name: param,
      folderPath: navigation,
    })

    data.forEach(({ fileName, folderPath, folderName }) => {
      this.base.createFolderInProject(folderPath)
      this.base.createFilesInProject(
        SCREEN_CONFIG({ fileName, folderName, folderPath }),
      )
    })
  }

  async chooseNavigation() {
    const navigations = this.base
      .getNestedFolders(SCREEN_FOLDER_PATH)
      .filter(item => !item.folderName.includes('Screen'))
      .map(item => ({ name: item.folderName, value: item.path }))

    return await inquirer
      .prompt([
        {
          name: 'variant',
          message: 'Choose Navigation',
          type: 'list',
          choices: [
            { name: 'RootNavigation', value: SCREEN_FOLDER_PATH },
            ...navigations,
          ],
          pageSize: Object.keys(ECommands).length + 3,
        },
      ])
      .then(res => res.variant)
  }
}
