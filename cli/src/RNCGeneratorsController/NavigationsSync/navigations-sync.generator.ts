import {
  INavigation,
  INavigationsSyncGenerator,
  NavigationParam,
  NavigationType,
} from './types'
import { inject, injectable } from 'inversify'
import { BaseId, IBase, IInsertoIntoProjectFileParams } from '../../Base'
import { IValidators, ValidatorsId } from '../../Validators'
import fs from 'fs'
import { PROJECT_PATH } from '../../constants'
import yaml from 'yaml'
import chalk from 'chalk'
import shell from 'shelljs'
import { SCREEN_CONFIG } from '../../RNCCommandsController/Commands/ScreenCommands/constants'
import { NAVIGATION_CONFIG } from './constants'

export const NavigationsSyncGeneratorId = Symbol.for('NavigationsSyncGenerator')

@injectable()
export class NavigationsSyncGenerator implements INavigationsSyncGenerator {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}

  async init() {
    /*
     * 1. Read file config/Navigation.index.yaml, get navigation tree
     * */
    const navigationTree = this.getNavigationTree()
    const screensFoldersTree = this.base.getNestedFolders('/src/ui/screens')

    for (const rootNavigationKey in navigationTree) {
      const val = navigationTree[rootNavigationKey]
      this.generateFolders(rootNavigationKey, val, '', screensFoldersTree)
    }

    this.syncNavigation(
      'RootNavigation',
      this.getNavigationChildrens(navigationTree),
    )
  }

  generateFolders(
    key: string,
    val: null | INavigation,
    parent = '',
    screens: { path: string; folderName: string }[] = [],
  ) {
    // TODO создать группу
    let valid = true

    if (key.includes('Screen')) {
      this.generateScreen(key, parent, screens)
    }
    // else if (key.includes('Group')) {
    //   this.generateGroup(key, parent)
    // }
    else if (key.includes('Navigation')) {
      this.generateNavigation(
        key,
        parent,
        val ? this.getNavigationChildrens(val, parent, key) : [],
      )
    } else {
      console.log(
        chalk.red(
          // key + ' invalid ([name]Screen, [name]Group, [name]Navigation)',
          key + ' invalid ([name]Screen, [name]Navigation)',
        ),
      )
      valid = false
    }

    if (val !== null && valid) {
      for (const valKey in val) {
        this.generateFolders(
          valKey,
          val[valKey],
          parent ? parent + '/' + key : key,
          screens,
        )
      }
    }
  }

  generateScreen(
    name: string,
    parent: string,
    screens: { path: string; folderName: string }[] = [],
  ) {
    const path = `/src/ui/screens/${parent ? parent + '/' : ''}${name}`
    const existedScreen = screens.find(
      item => item.folderName.replace(/-/g, '') === name,
    )
    // Check if exist in project and move if exist and create if not
    if (!existedScreen) {
      this.base.createFolderInProject(path)
      this.base.createFilesInProject(
        SCREEN_CONFIG({
          fileName: '',
          folderName: name,
          folderPath: path,
        }),
      )
    } else if (existedScreen.path !== path) {
      shell.mv(PROJECT_PATH + existedScreen.path, PROJECT_PATH + path)
    }
  }

  generateGroup(name: string, parent: string) {
    const path = `/src/ui/screens/${parent ? parent + '/' : ''}${name}`
    if (!this.base.isInProjectExist(path)) {
      this.base.createFolderInProject(path)
    }
  }

  generateNavigation(
    name: string,
    parent: string,
    childrens: NavigationParam[],
  ) {
    const screensGroup = `/src/ui/screens/${parent ? parent + '/' : ''}${name}`
    if (!this.base.isInProjectExist(screensGroup)) {
      this.base.createFolderInProject(screensGroup)
    }

    const navigationPath = `/src/ui/navigations/${name}`

    if (!this.base.isInProjectExist(navigationPath)) {
      this.base.createFolderInProject(navigationPath)

      let navigationType: NavigationType = NavigationType.Stack

      if (name.includes(NavigationType.NativeStack)) {
        navigationType = NavigationType.NativeStack
      } else if (name.includes(NavigationType.Stack)) {
        navigationType = NavigationType.Stack
      } else if (name.includes(NavigationType.Drawer)) {
        navigationType = NavigationType.Drawer
      } else if (name.includes(NavigationType.BottomTabs)) {
        navigationType = NavigationType.BottomTabs
      } else if (name.includes(NavigationType.MaterialBottomTabs)) {
        navigationType = NavigationType.MaterialBottomTabs
      } else if (name.includes(NavigationType.MaterialTopTabs)) {
        navigationType = NavigationType.MaterialTopTabs
      }

      this.base.createFilesInProject(
        NAVIGATION_CONFIG({
          folderName: name,
          fileName: `${name
            .toLowerCase()
            .replace('navigation', '')}.navigation`,
          folderPath: navigationPath,
          childrens: childrens,
          type: navigationType,
        }),
      )
    } else {
      this.syncNavigation(name, childrens)
    }
  }

  getNavigationChildrens(
    val: INavigation,
    parent = '',
    key = '',
  ): NavigationParam[] {
    return Object.keys(val).map(item => {
      const isScreen = item.includes('Screen')
      return {
        isScreen,
        path: isScreen
          ? `screens/${parent ? parent + '/' : ''}${
              key ? key + '/' : ''
            }${item}`
          : `navigations/${item}`,
        name: item,
      }
    })
  }

  syncNavigation(navigationName: string, childrens: NavigationParam[]) {
    const insert: IInsertoIntoProjectFileParams[] = []

    const screenImports: string[] = []
    const types: string[] = []
    const navigationScreens: string[] = []

    childrens.forEach(item => {
      types.push(`  ${item.name}: undefined`)
      screenImports.push(`import { ${item.name} } from '${item.path}';`)
      navigationScreens.push(
        `<Nav.Screen name={'${item.name}'} component={${item.name}} />`,
      )
    })

    const type: IInsertoIntoProjectFileParams = {
      path: `/src/ui/navigations/${navigationName}/types.ts`,
      content: types.join('\n') + '}',
      type: 'replace',
      searchRegex: /(?<== {)(.*?)(?=$)/s,
      checkExist: true,
    }

    const navigationPath = `/src/ui/navigations/${navigationName}/${navigationName
      .toLowerCase()
      .replace('navigation', '')}.navigation.tsx`

    const navigationImport: IInsertoIntoProjectFileParams = {
      path: navigationPath,
      content: screenImports.join('\n'),
      type: 'replace',
      searchRegex: /(?<=from 'react'\n)(.*?)(?=import \{ create)/gms,
    }

    const navigationScreen: IInsertoIntoProjectFileParams = {
      path: navigationPath,
      content: navigationScreens.join('\n'),
      type: 'replace',
      searchRegex: /(?<=>\n)(.*?)(?=<\/Nav.Navigator>)/s,
    }

    insert.push(...[type, navigationImport, navigationScreen])

    this.base.insertoIntoProjectFile(insert)
  }

  // Screen
  // Group
  // Navigation
  //  Stack
  //  BoottomBar
  //  Drawer
  getNavigationTree(): INavigation {
    const file = fs.readFileSync(
      PROJECT_PATH + '/src/configs/Navigation/index.yml',
      'utf8',
    )
    const res = yaml.parse(file)
    if (res.RootNavigation) {
      return res.RootNavigation
    } else {
      console.log(chalk.red('ERROR: Root Navigation required object'))
      shell.exit()
    }
  }
}
