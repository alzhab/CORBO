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
  getValidName(data: IValidNameData): Promise<IValidName>
  getValidEventName(name?: string): Promise<IValidEventName>
  getValidIconName(input: string): string
  getValidNames(
    data: IValidNamesData,
    checkNameEnd?: string,
  ): Promise<IValidName[]>
  getComponentsNames(paramName?: string | string[]): Promise<string[]>
}

export interface IValidName {
  folderName: string
  fileName: string
  folderPath: string
}

export interface IValidEventName {
  name: string
  transformedName: string
  functionName: string
}

export interface IValidNamesData {
  folderPath: string
  suffix?: string
  name?: string | string[]
}

export interface IValidNameData {
  folderPath: string
  suffix?: string
  name?: string
}
