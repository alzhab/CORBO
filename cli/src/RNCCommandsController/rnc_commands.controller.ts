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

  commands: { [key in ECommands]: (params: string[]) => void } = {
    // blm
    [ECommands.Blm]: params => this.blmCommands.init(params),

    // ui
    [ECommands.Component]: params => this.componentCommands.init(),
    [ECommands.Screen]: params => this.screenCommands.init(params),

    // instruments
    [ECommands.Repository]: params => this.repositoryCommands.init(params),
    [ECommands.Service]: params => this.serviceCommands.init(params),
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

  async init(params: string[]) {
    const command = await this.getChoosedCommand(params)

    await this.commands[command](params)
  }

  getChoosedCommand(options: string[]): Promise<ECommands> {
    const variantOption = options[0] ? options[0].toLowerCase() : ''
    let variants: ECommands | null = null

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
