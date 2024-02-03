import {useEffect} from 'react';
import {useInjection} from 'inversify-react';
import {useIsStoresHydrated} from '@corrbo/base/LocalStorage';
import {IRootFlow} from 'base/root-flow/types';
import {RootFlowId} from 'base/root-flow/root-flow';

export const useInitAppAdapter = (hydratedStoresIds: symbol[]) => {
  const rootFlow = useInjection<IRootFlow>(RootFlowId)
  
  const isStoresHydrated = useIsStoresHydrated(hydratedStoresIds)
  
  useEffect(() => {
    if (isStoresHydrated) {
      rootFlow.init()
    }
  }, [isStoresHydrated])
}
