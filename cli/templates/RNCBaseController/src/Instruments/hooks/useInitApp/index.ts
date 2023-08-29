import { useEffect, useMemo } from 'react'
import { useInjection } from 'inversify-react'
import { AppFlowId } from 'flow/flow'
import { IAppFlow } from 'flow/types'
import { useIsStoresHydrated } from '@corbo/base/LocalStorageModule'
import {
  AppEventsStoreId,
  IAppEventsStore,
} from '@corbo/base/AppEventsModule'

export const useInitApp = (hydratedStoresIds: symbol[]) => {
  const appFlow = useInjection<IAppFlow>(AppFlowId)
  const store = useInjection<IAppEventsStore>(AppEventsStoreId)
  
  const isStoresHydrated = useIsStoresHydrated(hydratedStoresIds)
  const isAppInitialized = useMemo(
    () => store.isAppInitialized,
    [store.isAppInitialized],
  )
  
  useEffect(() => {
    if (isStoresHydrated) {
      appFlow.init()
    }
  }, [isStoresHydrated])
  
  return {
    isAppInitialized,
  }
}
