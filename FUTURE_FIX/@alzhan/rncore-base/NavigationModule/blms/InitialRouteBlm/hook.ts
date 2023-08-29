import { useInjection } from 'inversify-react'
import { useMemo } from 'react'
import { IInitialRouteStore, InitialRouteStoreId } from '../../stores'

export function useInitialRouteBlm() {
  const initialRouteStore =
    useInjection<IInitialRouteStore>(InitialRouteStoreId)

  const initialScreen = useMemo(
    () => initialRouteStore.initialScreen,
    [initialRouteStore.initialScreen],
  )

  return {
    initialScreen,
  }
}
