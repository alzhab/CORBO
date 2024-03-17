import React, { useEffect, useMemo } from 'react'
import { observer } from 'mobx-react'
import { Navigation } from 'navigations/Navigation'
import { Boot } from 'templates/Boot'
import { useInitialScreenAdapter } from '@corrbo/module-navigation/blm/ui-adapters/initial-screen.adapter'
import { useIsStoresHydrated } from '@corrbo/module-localstorage/hooks/useIsStoresHydrated'
import { EVENT_EMITTER } from '@corrbo/base/IOC/IOCProvider'
import { HYDRATED_STORES } from './blms/hydrated-stores'
import { EAppStateFlowEvents } from './blms/AppStateBlm/flow'

const EntryPoint = observer(() => {
  // const { activeThemeName } = useTheme()
  const { initialScreen, isNavigationReady } = useInitialScreenAdapter()

  const isStoresHydrated = useIsStoresHydrated(HYDRATED_STORES)

  const hideBoot = useMemo(
    () => isNavigationReady && !!initialScreen && isStoresHydrated,
    [isNavigationReady, initialScreen, isStoresHydrated],
  )

  useEffect(() => {
    if (isStoresHydrated) {
      EVENT_EMITTER.emitEvent({ name: EAppStateFlowEvents.ON_APP_OPEN })
    }
  }, [isStoresHydrated])

  return (
    <>
      {/*<StatusBar {...COLORS_SB_PROPS[activeThemeName]} />*/}

      <Navigation initialScreen={initialScreen} />

      <Boot hide={hideBoot} />
    </>
  )
})

export default EntryPoint
