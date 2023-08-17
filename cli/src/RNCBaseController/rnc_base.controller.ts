import { IRNCBaseController } from './types'
import { inject, injectable } from 'inversify'
import { IValidators, ValidatorsId } from '../Validators'
import {
  NAVIGATION_CONFIGURATION,
  RNCBASE_DEPENDENCIES,
  RNCBASE_DEV_DEPENDENCIES,
  RNCBASE_TEMPLATE_PATH,
  TEMPLATE_PATHES,
} from './constants'
import { BaseId, IBase } from '../Base'
import shell from 'shelljs'
import chalk from 'chalk'

export const RNCBaseControllerId = Symbol.for('RNCBaseConrolerId')

@injectable()
export class RNCbaseController implements IRNCBaseController {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}

  async init() {
    this.base.copyToProject(
      TEMPLATE_PATHES.map(item => ({
        pathFrom: RNCBASE_TEMPLATE_PATH + item,
        pathTo: '/',
        type: item === '/src' ? 'folder' : 'file',
      })),
    )

    await this.base.installDependencies(RNCBASE_DEPENDENCIES)
    await this.base.installDependencies(RNCBASE_DEV_DEPENDENCIES, true)
    this.dependenciesConfiguration()
    await this.base.installPods()
    shell.exec('clear')
    console.log(
      chalk.green('Please, Set eslint and prettier in IDLE settings '),
    )
  }

  dependenciesConfiguration() {
    // NAVIGATION
    this.base.insertoIntoProjectFile(NAVIGATION_CONFIGURATION)
  }
}
