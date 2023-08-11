export interface ISpacingPropsModule {
  init(): Promise<void>
  checkInstall(): Promise<boolean>
}
