import { inject, injectable } from 'inversify'
import { ECommands, IRNCCommandsController } from './types'
import inquirer from 'inquirer'
import { BlmCommandsId, IBlmCommands } from './Commands/BLMCommands'
import { IServiceCommands, ServiceCommandsId } from './Commands/ServiceCommands'
import { IScreenCommands, ScreenCommandsId } from './Commands/ScreenCommands'
import { IValidators, ValidatorsId } from '../Validators'
import {
  IRepositoryCommands,
  RepositoryCommandsId,
} from './Commands/RepositoryCommands'
import {
  ComponentCommandsId,
  IComponentCommands,
} from './Commands/ComponentCommands'
import { TCommandReturn } from '../types'
import minimist from 'minimist'

export const RNCCommandsControllerId = Symbol.for('RNCCommandsControllerId')

@injectable()
export class RNCCommandsController implements IRNCCommandsController {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BlmCommandsId) private blmCommands: IBlmCommands,
    @inject(ServiceCommandsId) private serviceCommands: IServiceCommands,
    @inject(ScreenCommandsId) private screenCommands: IScreenCommands,
    @inject(RepositoryCommandsId)
    private repositoryCommands: IRepositoryCommands,
    @inject(ComponentCommandsId)
    private componentCommands: IComponentCommands,
  ) {}

  commands: {
    [key in ECommands]: () => Promise<TCommandReturn>
  } = {
    // blm
    [ECommands.Blm]: () => this.blmCommands.init(),

    // ui
    [ECommands.Component]: () => this.componentCommands.init(),
    [ECommands.Screen]: () => this.screenCommands.init(),

    // instruments
    [ECommands.Repository]: () => this.repositoryCommands.init(),
    [ECommands.Service]: () => this.serviceCommands.init(),
  }

  disabledCommands: { [key in ECommands]: boolean } = {
    // blm
    [ECommands.Blm]: false,

    // ui
    [ECommands.Component]: false,
    [ECommands.Screen]: false,

    // instruments
    [ECommands.Repository]: !this.validators.isNetworkModuleInitialized,
    [ECommands.Service]: false,
  }

  variants = {
    [ECommands.Blm]: ['blm', 'b'],

    // ui
    [ECommands.Component]: ['component', 'components', 'comp', 'c'],
    [ECommands.Screen]: ['screen', 'scr', 's'],

    // instruments
    [ECommands.Repository]: ['repository', 'rep', 're'],
    [ECommands.Service]: ['service', 'ser'],
  }

  async init() {
    const command = await this.getChoosedCommand()

    await this.commands[command]()
  }

  getChoosedCommand(): Promise<ECommands> {
    const { _: params } = minimist(process.argv.slice(3))

    let variants: ECommands | null = null
    const variantOption = params[0]

    if (variantOption) {
      for (let i = 0; i <= Object.keys(this.variants).length; i++) {
        const key = Object.keys(this.variants)[i] as ECommands
        if (this.variants[key] && this.variants[key].includes(variantOption)) {
          variants = key
          break
        }
      }

      if (variants) {
        return Promise.resolve(variants)
      }
    }

    return inquirer
      .prompt([
        {
          name: 'commands',
          message: 'Commands to install',
          type: 'list',
          choices: this.commandsChoices,
          pageSize: Object.keys(ECommands).length + 3,
        },
      ])
      .then(res => res.commands)
  }

  get commandsChoices() {
    return [
      new inquirer.Separator('Business Logic'),
      {
        value: ECommands.Blm,
        name: ECommands.Blm,
        disabled: this.disabledCommands[ECommands.Blm],
      },

      new inquirer.Separator('ui'),
      {
        value: ECommands.Component,
        name: ECommands.Component,
        disabled: this.disabledCommands[ECommands.Component],
      },
      {
        value: ECommands.Screen,
        name: ECommands.Screen,
        disabled: this.disabledCommands[ECommands.Screen],
      },

      new inquirer.Separator('instruments'),
      {
        value: ECommands.Repository,
        name: ECommands.Repository,
        disabled: this.disabledCommands[ECommands.Repository],
      },
      {
        value: ECommands.Service,
        name: ECommands.Service,
        disabled: this.disabledCommands[ECommands.Service],
      },
    ]
  }
}
