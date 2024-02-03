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
import {
  IRNCGeneratorsController,
  RNCGeneratorsControllerId,
} from '../RNCGeneratorsController'
import { TCommandReturn } from '../types'

export const CliControllerId = Symbol('CliControllerId')

@injectable()
export class CliController implements ICliController {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
    @inject(RNCBaseControllerId) private RNCBaseController: IRNCBaseController,
    @inject(RNCGeneratorsControllerId)
    private RNCGeneratorsController: IRNCGeneratorsController,
    @inject(RNCModulesControllerId)
    private RNCModulesController: IRNCModulesController,
    @inject(RNCCommandsControllerId)
    private RNCCommandsController: IRNCCommandsController,
  ) {}

  calls: {
    [key in ECliVariants]: () => Promise<TCommandReturn>
  } = {
    [ECliVariants.Commands]: () => this.RNCCommandsController.init(),
    [ECliVariants.Modules]: () => this.RNCModulesController.init(),
    [ECliVariants.Generators]: () => this.RNCGeneratorsController.init(),
  }

  variants = {
    [ECliVariants.Modules]: ['modules', 'module', 'modul', 'mod', 'm'],
    [ECliVariants.Commands]: ['commands', 'command', 'com', 'c'],
    [ECliVariants.Generators]: ['generators', 'generator', 'g', 'gen'],
  }

  rnc(options: string[]) {
    return this.initializationCheck(() => {
      return this.getChoosedVariant(options).then(variant => {
        return this.calls[variant]()
      })
    })
  }

  async initializationCheck(call: () => void) {
    if (this.validators.isRNProject) {
      if (!this.validators.isProjectInitialized) {
        const { confirmToIninit } = await inquirer.prompt([
          {
            name: 'confirmToIninit',
            message: 'Do you want to install Corbo Base ?',
            type: 'confirm',
          },
        ])

        if (confirmToIninit) {
          await this.RNCBaseController.init()
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
