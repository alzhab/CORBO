import { useInjection } from 'inversify-react'
import { useCallback } from 'react'
import { IAppEventsBlm } from './types'
import { AppEventsBlmId } from './appevents.blm'
import { EAppEvents } from 'flow/types'

export function useAppEventsBlm() {
  const appEventsBlm = useInjection<IAppEventsBlm>(AppEventsBlmId)

  const emitEvent = useCallback(
    (key: EAppEvents, data?: any) => appEventsBlm.emitEvent(key, data),
    [],
  )

  return {
    emitEvent,
  }
}
