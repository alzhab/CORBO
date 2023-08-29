import { useInjection } from 'inversify-react'
import { useCallback } from 'react'
import { IAppEventsBlm } from './types'
import { AppEventsBlmId } from './appevents.blm'
import { EAppEvents, IAppEventsData } from "flow/types";

export function useAppEventsBlm() {
  const appEventsBlm = useInjection<IAppEventsBlm>(AppEventsBlmId)

  const emitEvent = useCallback(
    <EventName  extends keyof IAppEventsData>(    data: undefined extends IAppEventsData[EventName] ? {event: EventName} : {event: EventName, data: IAppEventsData[EventName]}
    ) => appEventsBlm.emitEvent(data),
    [],
  )

  return {
    emitEvent,
  }
}
