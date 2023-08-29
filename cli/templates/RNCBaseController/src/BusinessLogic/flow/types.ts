export enum EAppEvents {
  APP_INIT = 'APP_INIT',
}

export type IAppEventsData = {
  [EAppEvents.APP_INIT]: undefined
}

export interface IAppFlow {
  init(): void
  flows: IFlows
}

export type IAppFLowMethod<EventName extends keyof IAppEventsData> =
  undefined extends IAppEventsData[EventName]
    ? {
      (): void
    }
    : {
      (data: IAppEventsData[EventName]): void
    }

export type IFlows = { [key in keyof IAppEventsData]: IAppFLowMethod<key> }
