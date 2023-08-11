import { useEffect } from 'react'
import { useInjection } from 'inversify-react'
import { AppFlowId } from 'flow/flow'
import { EAppEvents, IAppFlow } from 'flow/types'
import { useAppEventsBlm } from '@alzhan/rncore-base/AppEventsModule'
import { useIsStoresHydrated } from '@alzhan/rncore-base/LocalStorageModule'

export const useInitApp = (hydratedStoresIds: symbol[]) => {
  const appFlow = useInjection<IAppFlow>(AppFlowId)
  const { emitEvent } = useAppEventsBlm()

  const isStoresHydrated = useIsStoresHydrated(hydratedStoresIds)

  useEffect(() => {
    appFlow.init()
  }, [])

  useEffect(() => {
    if (isStoresHydrated) {
      emitEvent(EAppEvents.APP_INIT)
    }
  }, [isStoresHydrated])
}
