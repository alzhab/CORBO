import { inject, injectable } from 'inversify'
import { EComponentTypes, IComponentCommands } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import { COMPONENT_CREATE_FILES, COMPONENT_FOLDER_PATH } from './constants'
import chalk from 'chalk'
import inquirer from 'inquirer'
import minimist from 'minimist'

export const ComponentCommandsId = Symbol('ComponentCommandsId')

@injectable()
export class ComponentCommands implements IComponentCommands {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}
  async init(): Promise<void> {
    const { _: names = [''] } = minimist(process.argv.slice(4))

    const data = await this.validators.getComponentsNames(names)

    return this.base.promiseOneByOne(
      data.map(
        component => () => this.createComponent(component.split(':') as any),
      ),
    )
  }

  async createComponent([name, type]: [name: string, type: EComponentTypes]) {
    type = await this.getType(name, type)

    if (
      this.base.isInProjectExist(
        COMPONENT_FOLDER_PATH + '/' + type + '/' + name,
      )
    ) {
      console.log(chalk.red(`Compnonent ${name} already exist`))

      return Promise.resolve()
    }

    const { fileName, folderName, folderPath } =
      await this.validators.getValidName({
        suffix: '',
        name,
        folderPath: COMPONENT_FOLDER_PATH + '/' + type,
      })

    this.base.createFolderInProject(folderPath)
    this.base.createFilesInProject(
      COMPONENT_CREATE_FILES({ fileName, folderPath, folderName }),
    )
  }

  getType(name: string, type: string) {
    if (Object.keys(EComponentTypes).includes(type)) {
      return type
    }
    console.log(chalk.green(`Type for ${name} component`))

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
