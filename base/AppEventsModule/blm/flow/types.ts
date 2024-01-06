import {IBaseFlow, IFlowReactions} from 'base/root-flow';

export type IAppEventsFlow = IBaseFlow & {
  subscibeToEvents(reactions: IFlowReactions): void
}

export enum EAppEvents {}

export type IAppEventsData = {}

