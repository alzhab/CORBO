export interface IRNCModulesController {
  init(): Promise<void>
}

export enum EModules {
  Localization = 'Localization',
  Network = 'Network',
  SpacingProps = 'Spacing Props',
  Theme = 'Theme',
}
