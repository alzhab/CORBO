import { IRNCBaseController } from './types'
import { inject, injectable } from 'inversify'
import {
  NAVIGATION_CONFIGURATION,
  RNCBASE_DEPENDENCIES,
  RNCBASE_DEV_DEPENDENCIES,
  TEMPLATE_PATHES,
} from './constants'
import { BaseId, IBase } from '../Base'
import shell from 'shelljs'
import chalk from 'chalk'
import {
  AppIconGeneratorId,
  IAppIconGenerator,
} from '../RNCGeneratorsController/AppIcon'
import inquirer from 'inquirer'

export const RNCBaseControllerId = Symbol.for('RNCBaseConrolerId')

@injectable()
export class RNCbaseController implements IRNCBaseController {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(AppIconGeneratorId) private appIconGenerator: IAppIconGenerator,
  ) {}

  async init() {
    await this.changeName()

    this.base.copyToProject(TEMPLATE_PATHES)

    await this.base.installDependencies(RNCBASE_DEPENDENCIES)

    await this.base.installDependencies(RNCBASE_DEV_DEPENDENCIES, true)

    this.dependenciesConfiguration()

    await this.appIconGenerator.init()

    shell.exec('clear')

    console.log(chalk.green('Please, Set eslint and prettier in IDE settings '))
  }

  dependenciesConfiguration() {
    // NAVIGATION
    this.base.insertoIntoProjectFile(NAVIGATION_CONFIGURATION)
  }

  async changeName() {
    // Узнать название приложения через inquirer
    const name = await inquirer
      .prompt([
        {
          type: 'input',
          message: 'App name:',
          name: 'name',
        },
      ])
      .then(res => res.name)

    const appName = this.base.getAppName()

    // IOS Info.plist, после CFBundleDisplayName заменить название
    // Android values/strings.xml, после <string name="app_name"> заменить название
    this.base.insertoIntoProjectFile([
      {
        path: `/ios/${appName}/Info.plist`,
        type: 'replace',
        searchRegex:
          /(?<=<key>CFBundleDisplayName<\/key>\n\t<string>)(.*?)(?=<\/string>)/,
        content: name,
      },
      {
        path: `/android/app/src/main/res/values/strings.xml`,
        type: 'replace',
        searchRegex: new RegExp(
          /(?<=<string name="app_name">)(.*?)(?=<\/string>)/,
        ),
        content: name,
      },
    ])
  }
}
