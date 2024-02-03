import { EGenerators, IRNCGeneratorsController } from './types'
import { ECommands } from '../RNCCommandsController'
import { inject, injectable } from 'inversify'
import { ApiGeneratorId, IApiGenerator } from './API'
import inquirer from 'inquirer'
import { IValidators, ValidatorsId } from '../Validators'
import { BaseId, IBase } from '../Base'
import { CONFIG_SWAGGER_PATH } from './API/constants'
import { TCommandReturn } from '../types'
import minimist from 'minimist'

export const RNCGeneratorsControllerId = Symbol.for('RNCGeneratorsController')

@injectable()
export class RNCGeneratorsController implements IRNCGeneratorsController {
  constructor(
    @inject(ApiGeneratorId) private apiGenerator: IApiGenerator,
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}

  generators: { [key in EGenerators]: () => Promise<TCommandReturn> } = {
    [EGenerators.Api]: () => this.apiGenerator.init(),
  }

  variants = {
    [EGenerators.Api]: ['api'],
  }

  async init(): Promise<TCommandReturn> {
    const { _: names } = minimist(process.argv.slice(2))
    const command = await this.getChoosedGenerator(names)

    return this.generators[command]()
  }

  getChoosedGenerator(options: string[]): Promise<EGenerators> {
    const variantOption = options[0] ? options[0].toLowerCase() : ''
    let variants: EGenerators | null = null

    if (variantOption) {
      for (let i = 0; i <= Object.keys(this.variants).length; i++) {
        const key = Object.keys(this.variants)[i] as EGenerators
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
          pageSize: Object.keys(ECommands).length,
        },
      ])
      .then(res => res.commands)
  }

  get commandsChoices() {
    return [
      {
        value: EGenerators.Api,
        name: EGenerators.Api,
        disabled: !(
          this.base.isInProjectExist(CONFIG_SWAGGER_PATH) &&
          this.validators.isNetworkModuleInitialized
        ),
      },
    ]
  }
}
