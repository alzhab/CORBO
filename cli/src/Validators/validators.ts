import { IValidators, IValideEventName, IValideName } from './types'
import fs from 'fs'
import { PROJECT_PATH } from '../constants'
import { injectable } from 'inversify'
import inquirer from 'inquirer'
import { BOOT_MODULE_DEPENDENCIES } from '../RNCModulesController/Modules/BootModule/constants'
import { SPACING_PROPS_DEPENDENCIES } from '../RNCModulesController/Modules/SpacingPropsModule/constants'
import { LOCALIZATION_MODULE_DEPENDENCIES } from '../RNCModulesController/Modules/LocalizationModule/constants'
import { NETWORK_MODULE_DEPENDENCIES_AXIOS } from '../RNCModulesController/Modules/NetworkModule/constants'

export const ValidatorsId = Symbol.for('ValidatorsId')

@injectable()
export class Validators implements IValidators {
  packageJsonFile: any = JSON.parse(
    fs.readFileSync(PROJECT_PATH + '/package.json').toString(),
  )
  // Check is RN Project
  get isRNProject() {
    // Get package json file
    // check react and react native project exist
    const dependencies = this.packageJsonFile.dependencies
    return ['react', 'react-native'].every(item => !!dependencies[item])
  }

  // Check is project initialized
  get isProjectInitialized(): boolean {
    return this.packageJsonFile.dependencies['@corrbo/base']
  }

  // Check is ThemeModule initialized
  get isThemeModuleInitialized(): boolean {
    return fs.existsSync(PROJECT_PATH + '/src/Configs/Theme')
  }

  getIsDependenciesExist(list: string[]) {
    const dependencies = this.packageJsonFile.dependencies
    return list.every(item => !!dependencies[item])
  }

  removeSuffix(input: string): string {
    return input
      .toLowerCase()
      .replace(/blm|store|service|component|screen|repo|\s/g, '')
  }

  toUpperCase(input?: string): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : ''
  }

  // input ['AuthorizationDataBlm', 'Authorization DataBlm', 'authorizationDataBlm']
  // output {
  //    folderName: AuthorizationData
  //    fileName: authorizationData.blm.tsx
  // }
  async getName(paramName?: string): Promise<string> {
    if (paramName) {
      return Promise.resolve(paramName)
    } else {
      return inquirer
        .prompt([
          {
            type: 'input',
            message: 'Name:',
            name: 'name',
          },
        ])
        .then(res => this.removeSuffix(res.name))
    }
  }

  async getValidName(
    suffix?: string,
    paramName?: string,
  ): Promise<IValideName> {
    const name = await this.getName(paramName)

    // разделить слова
    const splittedWords = name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      // удалить суфикс
      .filter(
        item =>
          !['blm', 'store', 'service', 'component', 'screen', 'repo'].includes(
            item.toLowerCase(),
          ),
      )
      .map((item, index) => (index === 0 ? this.toUpperCase(item) : item))

    const folderName =
      splittedWords.map(item => this.toUpperCase(item)).join('') +
      this.toUpperCase(suffix)
    const fileName = splittedWords.join('') + '.' + suffix

    return {
      folderName,
      fileName,
    }
  }

  toCamelCase(val: string) {
    return val.replace(/\s+(.)/g, function (match, group) {
      return group.toUpperCase()
    })
  }

  async getValidEventName(paramName?: string): Promise<IValideEventName> {
    if (paramName) {
      return {
        name: paramName,
        transformedName: paramName.replaceAll(' ', '_').toUpperCase(),
        functionName: this.toCamelCase('on ' + paramName.replace(/on/gi, '')),
      }
    }

    const name = await inquirer
      .prompt([
        {
          type: 'input',
          message: 'Event description:',
          name: 'name',
        },
      ])
      .then(res => res.name)

    return {
      name,
      transformedName: name.replaceAll(' ', '_').toUpperCase(),
      functionName: this.toCamelCase('on ' + name.replace(/on/gi, '')),
    }
  }

  get isNetworkModuleInitialized(): boolean {
    return (
      fs.existsSync(PROJECT_PATH + '/src/Instruments/base/BaseRest') &&
      this.getIsDependenciesExist(NETWORK_MODULE_DEPENDENCIES_AXIOS)
    )
  }

  get isMockModuleInitialized(): boolean {
    return fs.existsSync(PROJECT_PATH + '/src/Instruments/services/MockAdapter')
  }

  get isSpacingPropsModuleInitialized(): boolean {
    return this.getIsDependenciesExist(SPACING_PROPS_DEPENDENCIES)
  }

  get isBootModuleInitialized(): boolean {
    return this.getIsDependenciesExist(BOOT_MODULE_DEPENDENCIES)
  }

  get isLocalizationModuleInitialized(): boolean {
    return this.getIsDependenciesExist(LOCALIZATION_MODULE_DEPENDENCIES)
  }

  getValidIconName(input: string): string {
    const name = input.toLowerCase().replace(/icon|.svg/g, '')
    return this.toUpperCase(this.toCamelCase(name)) + 'Icon'
  }
}
