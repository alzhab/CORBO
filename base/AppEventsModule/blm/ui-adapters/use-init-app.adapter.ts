import {useEffect, useMemo} from 'react';
import {useInjection} from 'inversify-react';
import {useIsStoresHydrated} from '@corrbo/base/LocalStorageModule';
import {useInitialScreenAdapter} from '@corrbo/base/NavigationModule';
import {IRootFlow} from 'base/root-flow/types';
import {RootFlowId} from 'base/root-flow/root-flow';

export const useInitAppAdapter = (hydratedStoresIds: symbol[]) => {
  const rootFlow = useInjection<IRootFlow>(RootFlowId)
  
  const { isNavigationReady , initialScreen} = useInitialScreenAdapter()
  
  const isStoresHydrated = useIsStoresHydrated(hydratedStoresIds)
  
  const isAppInitialized = useMemo(() => !!initialScreen, [initialScreen])
  
  const hideBoot = useMemo(() =>  isNavigationReady && !!initialScreen, [
    isNavigationReady, initialScreen
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
