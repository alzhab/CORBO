import { Container } from 'inversify'
import { IThemeModule, ThemeModule, ThemeModuleId } from './Modules/ThemeModule'
import {
  RNCmodulesController,
  RNCModulesControllerId,
} from './rnc_modules.controller'
import { IRNCModulesController } from './types'
import {
  INetworkModule,
  NetworkModule,
  NetworkModuleId,
} from './Modules/NetworkModule'
import {
  ISpacingPropsModule,
  SpacingPropsModule,
  SpacingPropsModuleId,
} from './Modules/SpacingPropsModule'
import {
  ILocalizationModule,
  LocalizationModule,
  LocalizationModuleId,
} from './Modules/LocalizationModule'

export const bindModules = (container: Container) => {
  container
    .bind<IRNCModulesController>(RNCModulesControllerId)
    .to(RNCmodulesController)
  container.bind<IThemeModule>(ThemeModuleId).to(ThemeModule)
  container.bind<INetworkModule>(NetworkModuleId).to(NetworkModule)
  container
    .bind<ISpacingPropsModule>(SpacingPropsModuleId)
    .to(SpacingPropsModule)
  container
    .bind<ILocalizationModule>(LocalizationModuleId)
    .to(LocalizationModule)
}
