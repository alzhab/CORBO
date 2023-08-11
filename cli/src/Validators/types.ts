export interface IValidators {
  isRNProject: boolean
  isProjectInitialized: boolean
  isThemeModuleInitialized: boolean
  isNetworkModuleInitialized: boolean
  isMockModuleInitialized: boolean
  isSpacingPropsModuleInitialized: boolean
  isBootModuleInitialized: boolean
  isLocalizationModuleInitialized: boolean
  getIsDependenciesExist(list: string[]): boolean
  getValidName(suffix?: string): Promise<IValideName>
  getValidEventName(): Promise<IValideEventName>
  getValidIconName(input: string): string
}

export interface IValideName {
  name: string
  folderName: string
  fileName: string
}

export interface IValideEventName {
  name: string
  transformedName: string
  functionName: string
}
