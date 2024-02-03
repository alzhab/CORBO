import { Container } from 'inversify'
import { IFlowReactionsData, IFlowReactions } from "base/root-flow";
import {EFlowEvents} from 'base/root-flow';

export interface IAppEventsStore {
  event: { key: EFlowEvents; data?: any } | null
  addEvent<D>(key: EFlowEvents, data?: D): void
  removeEvent(): void
}

export type TBindContainer = (container: Container) => void

export interface IEventEmiter {
  emitEvent<EventName  extends keyof IFlowReactionsData>(
    data: undefined extends IFlowReactionsData[EventName] ? {event: EventName} : {event: EventName, data: IFlowReactionsData[EventName]}
  ): void
  subscibeToEvents(reactions: IFlowReactions): void
}
