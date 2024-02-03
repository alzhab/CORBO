import { useInjection } from 'inversify-react'
import { useMemo } from 'react'
import {IInitialRouteStore, InitialRouteStoreId} from '../store';

export function useInitialScreenAdapter() {
  const store =
    useInjection<IInitialRouteStore>(InitialRouteStoreId)
  
  const isNavigationReady = useMemo(() => store.isNavigationReady, [store.isNavigationReady])
  
  const initialScreen = useMemo(
    () => store.initialScreen,
    [store.initialScreen],
  )
  
  return {
    initialScreen,
    isNavigationReady,
  }
}
