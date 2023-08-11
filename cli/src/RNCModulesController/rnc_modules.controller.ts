import { inject, injectable } from 'inversify'
import { EModules, IRNCModulesController } from './types'
import { IValidators, ValidatorsId } from '../Validators'
import { IRNCBaseController, RNCBaseControllerId } from '../RNCBaseController'
import { IThemeModule, ThemeModuleId } from './Modules/ThemeModule'
import { AppIconModuleId, IAppIconModule } from './Modules/AppIconModule'
import {
  ISplashScreenModule,
  SplashScreenModuleId,
} from './Modules/SplashScreenModule'
import inquirer from 'inquirer'
import { INetworkModule, NetworkModuleId } from './Modules/NetworkModule'
import { IconsModuleId, IIconsModule } from './Modules/IconsModule'
import {
  ISpacingPropsModule,
  SpacingPropsModuleId,
} from './Modules/SpacingPropsModule'
import { BootModuleId, IBootModule } from './Modules/BootModule'
import {
  ILocalizationModule,
  LocalizationModuleId,
} from './Modules/LocalizationModule'

export const RNCModulesControllerId = Symbol.for('RncModulesController')

@injectable()
export class RNCmodulesController implements IRNCModulesController {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(RNCBaseControllerId) private RNCBaseController: IRNCBaseController,
    @inject(ThemeModuleId) private ThemeModule: IThemeModule,
    @inject(AppIconModuleId) private AppIconModule: IAppIconModule,
    @inject(SplashScreenModuleId)
    private SplashScreenModule: ISplashScreenModule,
    @inject(NetworkModuleId)
    private NetworkModule: INetworkModule,
    @inject(IconsModuleId)
    private IconsModule: IIconsModule,
    @inject(SpacingPropsModuleId)
    private SpacingPropsModule: ISpacingPropsModule,
    @inject(BootModuleId) private BootModule: IBootModule,
    @inject(LocalizationModuleId)
    private LocalizationModule: ILocalizationModule,
  ) {}
  modules: { [key in EModules]: () => Promise<void> } = {
    [EModules.Theme]: () => this.ThemeModule.init(),
    [EModules.AppIcon]: () => this.AppIconModule.init(),
    [EModules.SplashScreen]: () => this.SplashScreenModule.init(),
    [EModules.Network]: () => this.NetworkModule.init(),
    [EModules.Mock]: () => this.NetworkModule.installMockModule(),
    [EModules.Icons]: () => this.IconsModule.init(),
    [EModules.SpacingProps]: () => this.SpacingPropsModule.init(),
    [EModules.Boot]: () => this.BootModule.init(),
    [EModules.Localization]: () => this.LocalizationModule.init(),
  }

  disabledModules: { [key in EModules]: boolean } = {
    [EModules.Theme]: this.validators.isThemeModuleInitialized,
    [EModules.AppIcon]: false,
    [EModules.SplashScreen]: false,
    [EModules.Network]: this.validators.isNetworkModuleInitialized,
    [EModules.Mock]:
      !this.validators.isNetworkModuleInitialized ||
      this.validators.isMockModuleInitialized,
    [EModules.Icons]: false,
    [EModules.SpacingProps]: this.validators.isSpacingPropsModuleInitialized,
    [EModules.Boot]: this.validators.isBootModuleInitialized,
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
          name: 'modules',
          message: 'Modules to install',
          type: 'checkbox',
          choices,
          pageSize,
        },
      ])
      .then(res => res.modules)
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
