import { IValidName } from '../../Validators'
import {
  NavigationConfigParams,
  NavigationParam,
  NavigationType,
} from './types'

export const NAVIGATION_TYPES = (
  data: IValidName & {
    childrens: NavigationParam[]
  },
) => `import { NavigationProp, RouteProp } from '@react-navigation/core/src/types'

export type ${data.folderName}ParamsMap = {
${data.childrens.map(item => `  ${item.name}: undefined`).join('\n')}
}

export type T${data.folderName} = NavigationProp<${data.folderName}ParamsMap>

export type ProfilesTabStackRoute<D extends keyof ${
  data.folderName
}ParamsMap> = RouteProp<{
  params: ${data.folderName}ParamsMap[D]
}>
`

const navigationConfig: {
  [key in NavigationType]: {
    importPath: string
    navProps: string
    createFuncName: string
  }
} = {
  [NavigationType.Stack]: {
    importPath: '@react-navigation/stack',
    navProps: 'screenOptions={{ headerShown: false }}',
    createFuncName: 'createStackNavigator',
  },
  [NavigationType.NativeStack]: {
    importPath: '@react-navigation/native-stack',
    navProps: 'screenOptions={{ headerShown: false }}',
    createFuncName: 'createNativeStackNavigator',
  },
  [NavigationType.Drawer]: {
    importPath: '@react-navigation/drawer',
    navProps: 'screenOptions={{ headerShown: false }}',
    createFuncName: 'createDrawerNavigator',
  },
  [NavigationType.BottomTabs]: {
    importPath: '@react-navigation/bottom-tabs',
    navProps: 'screenOptions={{ headerShown: false }}',
    createFuncName: 'createBottomTabsNavigator',
  },
  [NavigationType.MaterialBottomTabs]: {
    importPath: '@react-navigation/material-bottom-tabs',
    navProps: '',
    createFuncName: 'createMaterialBottomTabsNavigator',
  },
  [NavigationType.MaterialTopTabs]: {
    importPath: '@react-navigation/material-top-tabs',
    navProps: '',
    createFuncName: 'createMaterialTopTabsNavigator',
  },
}

export const NAVIGATION_FILE = (data: NavigationConfigParams) => {
  const { importPath, navProps, createFuncName } = navigationConfig[data.type]

  return `import React from 'react'
import { ${createFuncName} } from '${importPath}'
import { ${data.folderName}ParamsMap } from 'navigations/${
    data.folderName
  }/types'
${data.childrens
  .map(item => `import { ${item.name} } from '${item.path}'`)
  .join('\n')}

const Nav = ${createFuncName}<${data.folderName}ParamsMap>()

export const ${data.folderName} = () => {
  return (
    <Nav.Navigator${navProps ? ' ' + navProps : ''}>
${data.childrens
  .map(
    item =>
      `      <Nav.Screen name={'${item.name}'} component={${item.name}} />`,
  )
  .join('\n')}
    </Nav.Navigator>
  )
}
`
}

export const NAVIGATION_INDEX = (
  data: IValidName,
) => `export * from './${data.fileName}'
export * from './types'
`
