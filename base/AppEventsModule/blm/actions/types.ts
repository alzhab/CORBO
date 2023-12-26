import { IFlowReactionsData } from "base/root-flow";

export interface IAppEventsActions {
  emitEvent<EventName  extends keyof IFlowReactionsData>(
    data: undefined extends IFlowReactionsData[EventName] ? {event: EventName} : {event: EventName, data: IFlowReactionsData[EventName]}
  ): void
}

