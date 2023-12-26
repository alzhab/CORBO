import {IBaseFlow, IFlowReactions} from 'base/root-flow';

export type IAppEventsFlow = IBaseFlow & {
  subscibeToEvents(reactions: IFlowReactions): void
}

export enum EAppEvents {
  APP_INIT = 'APP_INIT',
}

export type IAppEventsData = {
  [EAppEvents.APP_INIT]: undefined
}

