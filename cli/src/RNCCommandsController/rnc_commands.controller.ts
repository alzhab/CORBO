import { inject, injectable } from 'inversify'
import { ECommands, IRNCCommandsController } from './types'
import inquirer from 'inquirer'
import { BlmCommandsId, IBlmCommands } from './Commands/BLMCommands'
import { IServiceCommands, ServiceCommandsId } from './Commands/ServiceCommands'
import { IStoreCommands, StoreCommandsId } from './Commands/StoreCommands'
import { FlowCommandsId, IFlowCommands } from './Commands/FlowCommands'
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
import { EModules } from '../RNCModulesController'
import { ECliVariants } from '../CliController'

export const RNCCommandsControllerId = Symbol.for('RNCCommandsControllerId')

@injectable()
export class RNCCommandsController implements IRNCCommandsController {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BlmCommandsId) private blmCommands: IBlmCommands,
    @inject(StoreCommandsId) private storeCommands: IStoreCommands,
    @inject(ServiceCommandsId) private serviceCommands: IServiceCommands,
    @inject(FlowCommandsId) private flowCommands: IFlowCommands,
    @inject(ScreenCommandsId) private screenCommands: IScreenCommands,
    @inject(RepositoryCommandsId)
    private repositoryCommands: IRepositoryCommands,
    @inject(ComponentCommandsId)
    private componentCommands: IComponentCommands,
  ) {}

  commands: { [key in ECommands]: () => void } = {
    // BusinessLogic
    [ECommands.Flow]: () => this.flowCommands.init(),
    [ECommands.Blm]: () => this.blmCommands.init(),
    [ECommands.Store]: () => this.storeCommands.init(),

    // UI
    [ECommands.Component]: () => this.componentCommands.init(),
    [ECommands.Screen]: () => this.screenCommands.init(),

    // Instruments
    [ECommands.Repository]: () => this.repositoryCommands.init(),
    [ECommands.Service]: () => this.serviceCommands.init(),
  }

  disabledCommands: { [key in ECommands]: boolean } = {
    // BusinessLogic
    [ECommands.Flow]: false,
    [ECommands.Blm]: false,
    [ECommands.Store]: false,

    // UI
    [ECommands.Component]: false,
    [ECommands.Screen]: false,

    // Instruments
    [ECommands.Repository]: !this.validators.isNetworkModuleInitialized,
    [ECommands.Service]: false,
  }

  variants = {
    [ECommands.Flow]: ['flow'],
    [ECommands.Blm]: ['blm'],
    [ECommands.Store]: ['store'],

    // UI
    [ECommands.Component]: ['component'],
    [ECommands.Screen]: ['screen'],

    // Instruments
    [ECommands.Repository]: ['repository'],
    [ECommands.Service]: ['service'],
  }

  async init(params: string[]) {
    const command = await this.getChoosedCommand(params)

    await this.commands[command]()
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
        value: ECommands.Flow,
        name: ECommands.Flow,
        disabled: this.disabledCommands[ECommands.Flow],
      },
      {
        value: ECommands.Blm,
        name: ECommands.Blm,
        disabled: this.disabledCommands[ECommands.Blm],
      },
      {
        value: ECommands.Store,
        name: ECommands.Store,
        disabled: this.disabledCommands[ECommands.Store],
      },

      new inquirer.Separator('UI'),
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

      new inquirer.Separator('Instruments'),
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
