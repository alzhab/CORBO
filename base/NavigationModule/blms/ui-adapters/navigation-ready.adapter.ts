import { useInjection } from 'inversify-react'
import { useMemo, useCallback } from 'react'
import {IInitialRouteStore, InitialRouteStoreId} from '../store';

export function useNavigationReadyAdapter() {
  const store =
    useInjection<IInitialRouteStore>(InitialRouteStoreId)
  
  const setNavigationReady = useCallback(
    () => {
      store.setIsNavigationReady(true)
    },
    []
  );
  
  
  return {
    setNavigationReady
  }
}
