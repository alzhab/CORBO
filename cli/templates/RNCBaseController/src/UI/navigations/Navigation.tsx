import React from 'react'
import { RootNavigation } from 'navigations/RootNavigation'
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { useInjection } from 'inversify-react'
import { TRoutes } from 'navigations/types'
import { StatusBar } from 'react-native'
import { observer } from 'mobx-react'
import {
  INavigationService,
  NavigationServiceId,
  useInitialRouteBlm,
} from '@corrbo/base/NavigationModule'

export const Navigation = observer(() => {
  const navigationService =
    useInjection<INavigationService>(NavigationServiceId)
  const navigationRef = useNavigationContainerRef<TRoutes>()
  const { initialScreen } = useInitialRouteBlm()

  return (
    <>
      <StatusBar />

      <NavigationContainer
        ref={navigationRef}
        onReady={() => navigationService.init(navigationRef)}>
        <RootNavigation initialScreen={initialScreen} />
      </NavigationContainer>
    </>
  )
})
