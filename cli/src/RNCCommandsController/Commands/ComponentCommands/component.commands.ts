import { inject, injectable } from 'inversify'
import { EComponentTypes, IComponentCommands } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import { COMPONENT_CREATE_FILES, COMPONENT_FOLDER_PATH } from './constants'
import chalk from 'chalk'
import shell from 'shelljs'
import inquirer from 'inquirer'

export const ComponentCommandsId = Symbol('ComponentCommandsId')

@injectable()
export class ComponentCommands implements IComponentCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(params: string[]): Promise<void> {
    const type = await this.getType()
    const { fileName, folderName } = await this.validators.getValidName(
      '',
      params,
    )
    const folderPath = COMPONENT_FOLDER_PATH + '/' + type + '/' + folderName

    if (this.base.isInProjectExist(folderPath)) {
      console.log(
        chalk.red(`ERROR: COMPONENT with name ${folderName} already exist`),
      )
      shell.exit()
    }

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      COMPONENT_CREATE_FILES({ fileName, folderPath, folderName }),
    )
  }

  getType() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'type',
          choices: (
            Object.keys(EComponentTypes) as Array<keyof typeof EComponentTypes>
          ).map(key => ({
            value: EComponentTypes[key],
            name: EComponentTypes[key],
          })),
        },
      ])
      .then(res => res.type)
  }
}
