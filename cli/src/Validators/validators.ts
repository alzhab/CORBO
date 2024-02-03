import {
  IValidators,
  IValidEventName,
  IValidName,
  IValidNameData,
} from './types'
import fs from 'fs'
import { PROJECT_PATH } from '../constants'
import { injectable } from 'inversify'
import inquirer from 'inquirer'
import { BOOT_MODULE_DEPENDENCIES } from '../RNCModulesController/Modules/BootModule/constants'
import { SPACING_PROPS_DEPENDENCIES } from '../RNCModulesController/Modules/SpacingPropsModule/constants'
import { LOCALIZATION_MODULE_DEPENDENCIES } from '../RNCModulesController/Modules/LocalizationModule/constants'
import { NETWORK_MODULE_DEPENDENCIES_AXIOS } from '../RNCModulesController/Modules/NetworkModule/constants'
import chalk from 'chalk'

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
    return fs.existsSync(PROJECT_PATH + '/src/configs/Theme')
  }

  getIsDependenciesExist(list: string[]) {
    const dependencies = this.packageJsonFile.dependencies
    return list.every(item => !!dependencies[item])
  }

  removeSuffix(input: string): string {
    return input.replace(
      /blm|store|service|component|screen|repo|adapter|\s/gim,
      '',
    )
  }

  upperCharacterOnIndex(string: string, index: number) {
    return (
      string.slice(0, index) +
      string[index].toUpperCase() +
      string.slice(index + 1)
    )
  }

  toUpperCase(input?: string): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : ''
  }

  toLowerCase(input?: string): string {
    return input ? input.charAt(0).toLowerCase() + input.slice(1) : ''
  }

  // input ['AuthorizationDataBlm', 'Authorization DataBlm', 'authorizationDataBlm']
  // output {
  //    folderName: AuthorizationData
  //    fileName: authorizationData.actions.tsx
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

  async getNames(paramName?: string | string[]): Promise<string[]> {
    if (paramName) {
      return Promise.resolve(
        typeof paramName === 'string' ? paramName.split(',') : paramName,
      )
    } else {
      return inquirer
        .prompt([
          {
            type: 'input',
            message: 'Name(divide by ,):',
            name: 'names',
          },
        ])
        .then(res => res.names.split(',').map(this.removeSuffix))
    }
  }

  async getComponentsNames(paramName?: string | string[]): Promise<string[]> {
    paramName =
      typeof paramName === 'string' ? paramName.replaceAll(' ', '') : paramName

    if (paramName && !!paramName.length) {
      return Promise.resolve(
        typeof paramName === 'string' ? paramName.split(',') : paramName,
      )
    } else {
      return inquirer
        .prompt([
          {
            type: 'input',
            message: 'Name:Type (divide by ,):',
            name: 'names',
          },
        ])
        .then(res => res.names.split(',').map(this.removeSuffix))
    }
  }

  async getValidName({
    suffix,
    name: paramName,
    folderPath,
  }: IValidNameData): Promise<IValidName> {
    const name = await this.getName(paramName)

    // разделить слова
    const splittedWords = this.getSplittedWords(name)
    const folderName = this.getFolderName(splittedWords, suffix)
    const fileName = this.getFileName(splittedWords, suffix)

    if (this.isInProjectExist(folderPath + '/' + folderName)) {
      console.log(chalk.red(`Folder ${folderName} already exist`))
      return await this.getValidName({ suffix, name: paramName, folderPath })
    } else {
      return {
        folderName,
        fileName,
        folderPath: folderPath + '/' + folderName,
      }
    }
  }

  async getValidNames(
    { suffix, name: paramName, folderPath: paramFolderPath }: IValidNameData,
    checkNameEnd: string,
  ): Promise<IValidName[]> {
    const names = await this.getNames(paramName)

    return names
      .filter(
        item =>
          !this.isInProjectExist(paramFolderPath + '/' + item + checkNameEnd),
      )
      .map(item => this.getValideNameData(item, paramFolderPath, suffix))
  }

  getValideNameData(name: string, paramFolderPath: string, suffix?: string) {
    const splittedWords = this.getSplittedWords(name)
    const folderName = this.getFolderName(splittedWords, suffix)
    const fileName = this.getFileName(splittedWords, suffix)
    const folderPath = paramFolderPath + '/' + folderName

    return {
      folderName,
      fileName,
      folderPath: folderPath + '/' + folderName,
    }
  }

  getSplittedWords(name: string) {
    return (
      name
        .replace(/([a-z])([A-Z])|-/g, '$1 $2')
        .split(' ')
        // удалить суфикс
        .filter(
          item =>
            ![
              'actions',
              'flow',
              'adapter',
              'blm',
              'store',
              'service',
              'component',
              'screen',
              'repo',
            ].includes(item.toLowerCase()),
        )
        .map((item, index) => {
          return index === 0 ? this.toUpperCase(item) : item
        })
    )
  }

  getFolderName(splittedWords: string[], suffix?: string) {
    return (
      splittedWords.map(item => this.toUpperCase(item)).join('') +
      this.toUpperCase(suffix)
    )
  }

  getFileName(splittedWords: string[], suffix?: string) {
    return (
      this.toLowerCase(splittedWords.join('')) + (suffix ? '.' + suffix : '')
    )
  }

  isInProjectExist(path: string): boolean {
    return fs.existsSync(PROJECT_PATH + path.replace(PROJECT_PATH, ''))
  }

  toCamelCase(val: string) {
    return val.replace(/\s+(.)/g, function (match, group) {
      return group.toUpperCase()
    })
  }

  async getValidEventName(paramName?: string): Promise<IValidEventName> {
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
      fs.existsSync(PROJECT_PATH + '/src/instruments/base/BaseRest') &&
      this.getIsDependenciesExist(NETWORK_MODULE_DEPENDENCIES_AXIOS)
    )
  }

  get isMockModuleInitialized(): boolean {
    return fs.existsSync(PROJECT_PATH + '/src/instruments/services/MockAdapter')
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
