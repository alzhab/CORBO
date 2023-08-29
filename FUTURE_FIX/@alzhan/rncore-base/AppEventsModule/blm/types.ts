import { IAppEventsData } from "flow/types";

export interface IAppEventsBlm {
  emitEvent<EventName  extends keyof IAppEventsData>(
    data: undefined extends IAppEventsData[EventName] ? {event: EventName} : {event: EventName, data: IAppEventsData[EventName]}
  ): void
}

