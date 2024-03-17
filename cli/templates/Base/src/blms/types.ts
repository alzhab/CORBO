import { EAppStateFlowEvents, IAppStateFlowData } from './AppStateBlm/flow'

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

export type EFlowEvents = EAppStateFlowEvents

export type IFlowReactionsData = IAppStateFlowData
