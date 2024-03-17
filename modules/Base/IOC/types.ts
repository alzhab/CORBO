import {Container} from 'inversify';
import {IFlowReactions, IFlowReactionsData} from 'blms/types';

export type TBindContainer = (container: Container) => void

export interface IEventEmiter {
  flowIds: Array<symbol>
  addFlowId(id: symbol): void
  emitEvent<EventName extends keyof IFlowReactionsData>(
    data: undefined extends IFlowReactionsData[EventName] ? {name: EventName} : {name: EventName, data: IFlowReactionsData[EventName]}
  ): void
  addReactions(val: IFlowReactions): void
}

export interface IBaseFlow {
  reactions: IFlowReactions
}
