import { useEffect, useMemo } from 'react'
import { useInjection } from 'inversify-react'
import { useIsStoresHydrated } from '@corrbo/base/LocalStorageModule'
import {
  AppEventsStoreId,
  IAppEventsStore,
} from '../store'
import {useInitialScreenAdapter} from '@corrbo/base/NavigationModule';
import {IRootFlow} from 'base/root-flow/types';
import {RootFlowId} from 'base/root-flow/root-flow';

export const useInitAppAdapter = (hydratedStoresIds: symbol[]) => {
  const rootFlow = useInjection<IRootFlow>(RootFlowId)
  const store = useInjection<IAppEventsStore>(AppEventsStoreId)
  const { isNavigationReady } = useInitialScreenAdapter()
  
  const isStoresHydrated = useIsStoresHydrated(hydratedStoresIds)
  const isAppInitialized = useMemo(
    () => store.isAppInitialized,
    [store.isAppInitialized],
  )
  
  const hideBoot = useMemo(() => isAppInitialized  && isNavigationReady, [
    isAppInitialized, isNavigationReady
  ])
  
  useEffect(() => {
    if (isStoresHydrated) {
      rootFlow.init()
    }
  }, [isStoresHydrated])
  
  return {
    isAppInitialized,
    hideBoot
  }
}
