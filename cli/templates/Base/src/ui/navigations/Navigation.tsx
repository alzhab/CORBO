import React, { FC, useCallback } from 'react'
import {
  RootNavigation,
  RootNavigationParamsMap,
} from 'navigations/RootNavigation'
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { useInjection } from 'inversify-react'
import { TRoutes } from 'navigations/types'
import { observer } from 'mobx-react'
import { useNavigationReadyAdapter } from '@corrbo/module-navigation/blm/ui-adapters/navigation-ready.adapter'
import {
  INavigationService,
  NavigationServiceId,
} from '@corrbo/module-navigation/services'

export const Navigation: FC<{
  initialScreen: null | keyof RootNavigationParamsMap
}> = observer(({ initialScreen }) => {
  const navigationService =
    useInjection<INavigationService>(NavigationServiceId)
  const navigationRef = useNavigationContainerRef<TRoutes>()
  const { setNavigationReady } = useNavigationReadyAdapter()

  const onReady = useCallback(() => {
    navigationService.init(navigationRef)
    setNavigationReady()
  }, [navigationRef, navigationService, setNavigationReady])

  return initialScreen ? (
    <NavigationContainer fallback={null} ref={navigationRef} onReady={onReady}>
      <RootNavigation initialScreen={initialScreen} />
    </NavigationContainer>
  ) : null
})
