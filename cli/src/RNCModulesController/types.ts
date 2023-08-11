export interface IRNCModulesController {
  init(): Promise<void>
}

export enum EModules {
  Theme = 'Theme',
  SplashScreen = 'Splash screen',
  AppIcon = 'App Icon',
  Network = 'Network',
  Mock = 'Mock',
  Icons = 'Icons',
  SpacingProps = 'Spacing Props',
  Boot = 'Boot',
  Localization = 'Localization',
}
