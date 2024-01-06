import React, { useCallback } from 'react'
import { RootNavigation } from 'navigations/RootNavigation'
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native'
import { useInjection } from 'inversify-react'
import { TRoutes } from 'navigations/types'
import { observer } from 'mobx-react'
import {
  INavigationService,
  NavigationServiceId,
  useInitialScreenAdapter,
  useNavigationReadyAdapter,
} from '@corrbo/base/NavigationModule'

export const Navigation = observer(() => {
  const navigationService =
    useInjection<INavigationService>(NavigationServiceId)
  const navigationRef = useNavigationContainerRef<TRoutes>()
  const { initialScreen } = useInitialScreenAdapter()
  const { setNavigationReady } = useNavigationReadyAdapter()

  const onReady = useCallback(() => {
    navigationService.init(navigationRef)
    setNavigationReady()
  }, [navigationRef, navigationService, setNavigationReady])

  return (
    <>
      <NavigationContainer ref={navigationRef} onReady={onReady}>
        {initialScreen && <RootNavigation initialScreen={initialScreen} />}
      </NavigationContainer>
    </>
  )
})
