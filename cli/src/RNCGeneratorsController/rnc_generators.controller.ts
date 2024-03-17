import { EGenerators, IRNCGeneratorsController } from './types'
import { inject, injectable } from 'inversify'
import { ApiGeneratorId, IApiGenerator } from './API'
import inquirer from 'inquirer'
import { IValidators, ValidatorsId } from '../Validators'
import { BaseId, IBase } from '../Base'
import { CONFIG_SWAGGER_PATH } from './API/constants'
import { TCommandReturn } from '../types'
import minimist from 'minimist'
import { IconsGeneratorId, IIconsGenerator } from './Icons'
import { AppIconGeneratorId, IAppIconGenerator } from './AppIcon'
import { IRNCBaseController, RNCBaseControllerId } from '../RNCBaseController'
import {
  INavigationsSyncGenerator,
  NavigationsSyncGeneratorId,
} from './NavigationsSync'

export const RNCGeneratorsControllerId = Symbol.for('RNCGeneratorsController')

@injectable()
export class RNCGeneratorsController implements IRNCGeneratorsController {
  constructor(
    @inject(ApiGeneratorId) private apiGenerator: IApiGenerator,
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
    @inject(IconsGeneratorId) private IconsGenerator: IIconsGenerator,
    @inject(AppIconGeneratorId) private AppIconGenerator: IAppIconGenerator,
    @inject(RNCBaseControllerId) private BaseConotroller: IRNCBaseController,
    @inject(NavigationsSyncGeneratorId)
    private NavigationSyncGenetator: INavigationsSyncGenerator,
  ) {}

  actions: { [key in EGenerators]: () => Promise<TCommandReturn> } = {
    [EGenerators.AppIcon]: () => this.AppIconGenerator.init(),
    [EGenerators.NavigationSync]: () => this.NavigationSyncGenetator.init(),
    [EGenerators.Api]: () => this.apiGenerator.init(),
    [EGenerators.Icons]: () => this.IconsGenerator.init(),
    [EGenerators.AppName]: () => this.BaseConotroller.changeName(),
  }

  variants = {
    [EGenerators.AppIcon]: ['appicon'],
    [EGenerators.NavigationSync]: ['navigation'],
    [EGenerators.Api]: ['api'],
    [EGenerators.Icons]: ['icons'],
    [EGenerators.AppName]: ['app name', 'appname'],
  }

  disabled: { [key in EGenerators]: boolean } = {
    [EGenerators.Api]:
      this.base.isInProjectExist(CONFIG_SWAGGER_PATH) &&
      this.validators.isNetworkModuleInitialized,
    [EGenerators.NavigationSync]: false,
    [EGenerators.AppIcon]: false,
    [EGenerators.Icons]: false,
    [EGenerators.AppName]: false,
  }

  async init(): Promise<TCommandReturn> {
    const { _: names } = minimist(process.argv.slice(2))
    const command = await this.getChoosedAction(names)

    return this.actions[command]()
  }

  getChoosedAction(options: string[]): Promise<EGenerators> {
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
          name: 'variants',
          message: 'Generators to install',
          type: 'list',
          choices: this.commandsChoices,
          pageSize: Object.keys(EGenerators).length,
        },
      ])
      .then(res => res.variants)
  }

  get commandsChoices() {
    return Object.values(EGenerators).map(key => ({
      value: key,
      name: key,
      disabled: (this.disabled as any)[key as any],
    }))
  }
}
