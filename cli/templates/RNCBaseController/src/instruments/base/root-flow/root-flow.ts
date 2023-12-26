import { IFlowReactions, IRootFlow } from './types'
import { inject, injectable } from 'inversify'
import { AppEventsFlowsId, IAppEventsFlow } from '@corrbo/base/AppEventsModule'

export const RootFlowId = Symbol.for('RootFlow')

@injectable()
export class RootFlow implements IRootFlow {
  constructor(@inject(AppEventsFlowsId) private appEvents: IAppEventsFlow) {}

  init() {
    this.appEvents.subscibeToEvents(this.reactions)
  }

  get reactions(): IFlowReactions {
    return {
      ...this.appEvents.reactions,
    }
  }
}
