import chalk from 'chalk'
import inquirer from 'inquirer'
import shell from 'shelljs'
import { inject, injectable } from 'inversify'

import { BaseId, IBase } from '../Base'
import { ECliVariants, ICliController } from './types'
import { IValidators, ValidatorsId } from '../Validators'
import { IRNCBaseController, RNCBaseControllerId } from '../RNCBaseController'
import {
  IRNCModulesController,
  RNCModulesControllerId,
} from '../RNCModulesController'
import {
  IRNCCommandsController,
  RNCCommandsControllerId,
} from '../RNCCommandsController'
import { IRNCUILibs, RNCUILibsId } from '../RNCUILibs'

export const CliControllerId = Symbol('CliControllerId')

@injectable()
export class CliController implements ICliController {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
    @inject(RNCBaseControllerId) private RNCBaseController: IRNCBaseController,
    @inject(RNCModulesControllerId)
    private RNCModulesController: IRNCModulesController,
    @inject(RNCCommandsControllerId)
    private RNCCommandsController: IRNCCommandsController,
    @inject(RNCUILibsId)
    private RNCUILibs: IRNCUILibs,
  ) {}

  calls: { [key in ECliVariants]: (params: string[]) => void } = {
    [ECliVariants.Commands]: params => this.RNCCommandsController.init(params),
    [ECliVariants.Modules]: () => this.RNCModulesController.init(),
    [ECliVariants.Generators]: () => console.log('In progress...'),
    [ECliVariants.UILibs]: () => this.RNCUILibs.init(),
  }

  variants = {
    [ECliVariants.Modules]: ['modules', 'module', 'modul', 'mod', 'm'],
    [ECliVariants.Commands]: ['commands', 'command', 'com', 'c'],
    [ECliVariants.UILibs]: ['uilibs', 'ui', 'uilib'],
    [ECliVariants.Generators]: ['generators', 'generator', 'g', 'gen'],
  }

  async rnc(options: string[]) {
    await this.initializationCheck(async () => {
      this.base.lintProjectFiles()
      const variant = await this.getChoosedVariant(options)
      await this.calls[variant](options.slice(1))
      this.base.lintProjectFiles()
    })
  }

  async initializationCheck(call: () => void) {
    if (this.validators.isRNProject) {
      // Check Is RNCBase Project initialized
      if (!this.validators.isProjectInitialized) {
        const { confirmToIninit } = await inquirer.prompt([
          {
            name: 'confirmToIninit',
            message: 'Do you want to install RNC Base ?',
            type: 'confirm',
          },
        ])

        if (confirmToIninit) {
          this.RNCBaseController.init()
          shell.exit()
        } else {
          shell.exit()
        }
      }

      call()
    } else {
      console.log(chalk.red('ERROR: Not react native project'))
    }
  }

  getChoosedVariant(options: string[]): Promise<ECliVariants> {
    const variantOption = options[0] ? options[0].toLowerCase() : ''
    let cliVariant: ECliVariants | null = null

    if (variantOption) {
      for (let i = 0; i <= Object.keys(this.variants).length; i++) {
        const key = Object.keys(this.variants)[i] as ECliVariants
        if (this.variants[key] && this.variants[key].includes(variantOption)) {
          cliVariant = key
          break
        }
      }

      if (cliVariant) {
        return Promise.resolve(cliVariant)
      }
    }

    const choices = [
      ECliVariants.Commands,
      ECliVariants.Modules,
      ECliVariants.Generators,
    ]

    return inquirer
      .prompt([
        {
          name: 'variant',
          type: 'list',
          message: 'Variant',
          choices: choices,
        },
      ])
      .then(res => res.variant)
  }
}