import { inject, injectable } from 'inversify'
import { EModules, IRNCModulesController } from './types'
import { IValidators, ValidatorsId } from '../Validators'
import { IThemeModule, ThemeModuleId } from './Modules/ThemeModule'
import inquirer from 'inquirer'
import { INetworkModule, NetworkModuleId } from './Modules/NetworkModule'
import {
  ISpacingPropsModule,
  SpacingPropsModuleId,
} from './Modules/SpacingPropsModule'
import {
  ILocalizationModule,
  LocalizationModuleId,
} from './Modules/LocalizationModule'

export const RNCModulesControllerId = Symbol.for('RncModulesController')

@injectable()
export class RNCmodulesController implements IRNCModulesController {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(ThemeModuleId) private ThemeModule: IThemeModule,
    @inject(NetworkModuleId)
    private NetworkModule: INetworkModule,
    @inject(SpacingPropsModuleId)
    private SpacingPropsModule: ISpacingPropsModule,
    @inject(LocalizationModuleId)
    private LocalizationModule: ILocalizationModule,
  ) {}

  modules: { [key in EModules]: () => Promise<void> } = {
    [EModules.Theme]: () => this.ThemeModule.init(),
    [EModules.Network]: () => this.NetworkModule.init(),
    [EModules.SpacingProps]: () => this.SpacingPropsModule.init(),
    [EModules.Localization]: () => this.LocalizationModule.init(),
  }

  disabledModules: { [key in EModules]: boolean } = {
    [EModules.Theme]: this.validators.isThemeModuleInitialized,
    [EModules.Network]: this.validators.isNetworkModuleInitialized,
    [EModules.SpacingProps]: this.validators.isSpacingPropsModuleInitialized,
    [EModules.Localization]: this.validators.isLocalizationModuleInitialized,
  }

  async init() {
    const res = await this.getChoosedModules()

    await this.resolvePromisesSeq(res.map(item => this.modules[item]()))
  }

  async resolvePromisesSeq(tasks: Promise<any>[]) {
    const results = []
    for (const task of tasks) {
      results.push(await task)
    }

    return results
  }

  getChoosedModules(): Promise<EModules[]> {
    const choices = this.modulesChoices
    const pageSize = Object.keys(EModules).length

    return inquirer
      .prompt([
        {
          name: 'variants',
          message: 'Modules to install',
          type: 'checkbox',
          choices,
          pageSize,
        },
      ])
      .then(res => res.variants)
  }

  get modulesChoices() {
    return (Object.keys(EModules) as Array<keyof typeof EModules>)
      .map(key => ({
        value: EModules[key],
        name: EModules[key],
        disabled: this.disabledModules[EModules[key]],
      }))
      .sort(item => (item.disabled ? 1 : -1))
  }
}
