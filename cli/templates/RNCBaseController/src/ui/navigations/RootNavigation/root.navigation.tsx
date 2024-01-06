import React, { FC } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { RootNavigationParamsMap } from './types'
import { HomeScreen } from 'screens/HomeScreen'

const Nav = createStackNavigator<RootNavigationParamsMap>()

export const RootNavigation: FC<{
  initialScreen: keyof RootNavigationParamsMap
}> = ({ initialScreen }) => {
  return (
    <Nav.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialScreen || 'HomeScreen'}>
      <Nav.Screen name={'HomeScreen'} component={HomeScreen} />
    </Nav.Navigator>
  )
}
