import { useInjection } from 'inversify-react'
import { useCallback } from 'react'
import { IAppEventsActions } from '../actions/types'
import { AppEventsActionsId } from '../actions/app-events.actions'
import { IFlowReactionsData } from 'base/root-flow'

export function useAppEventsAdapter() {
  const appEventsBlm = useInjection<IAppEventsActions>(AppEventsActionsId)

  const emitEvent = useCallback(
    <EventName  extends keyof IFlowReactionsData>(    data: undefined extends IFlowReactionsData[EventName] ? {event: EventName} : {event: EventName, data: IFlowReactionsData[EventName]}
    ) => appEventsBlm.emitEvent(data),
    [],
  )

  return {
    emitEvent,
  }
}
