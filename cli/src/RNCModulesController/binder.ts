import { Container } from 'inversify'
import {
  AppIconModule,
  AppIconModuleId,
  IAppIconModule,
} from './Modules/AppIconModule'
import {
  ISplashScreenModule,
  SplashScreenModule,
  SplashScreenModuleId,
} from './Modules/SplashScreenModule'
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
import { IconsModule, IconsModuleId, IIconsModule } from './Modules/IconsModule'
import { BootModule, BootModuleId, IBootModule } from './Modules/BootModule'
import {
  ILocalizationModule,
  LocalizationModule,
  LocalizationModuleId,
} from './Modules/LocalizationModule'

export const bindModules = (container: Container) => {
  container
    .bind<IRNCModulesController>(RNCModulesControllerId)
    .to(RNCmodulesController)
  container.bind<IAppIconModule>(AppIconModuleId).to(AppIconModule)
  container
    .bind<ISplashScreenModule>(SplashScreenModuleId)
    .to(SplashScreenModule)
  container.bind<IThemeModule>(ThemeModuleId).to(ThemeModule)
  container.bind<INetworkModule>(NetworkModuleId).to(NetworkModule)
  container
    .bind<ISpacingPropsModule>(SpacingPropsModuleId)
    .to(SpacingPropsModule)
  container.bind<IIconsModule>(IconsModuleId).to(IconsModule)
  container.bind<IBootModule>(BootModuleId).to(BootModule)
  container
    .bind<ILocalizationModule>(LocalizationModuleId)
    .to(LocalizationModule)
}
