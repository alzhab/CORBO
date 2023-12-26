import { EAppEvents, IAppEventsData } from '@corrbo/base/AppEventsModule'

export interface IBaseFlow {
  reactions: IFlowReactions
}

export type IFlowReactions = {
  [key in EFlowEvents]: IFlowAction<key>
}

export type IFlowAction<EventName extends EFlowEvents> =
  undefined extends IFlowReactionsData[EventName]
    ? {
        (): void
      }
    : {
        (data: IFlowReactionsData[EventName]): void
      }

export interface IRootFlow {
  init(): void
}

export type EFlowEvents = EAppEvents
export const EFlowEvents = { ...EAppEvents }

export type IFlowReactionsData = IAppEventsData
