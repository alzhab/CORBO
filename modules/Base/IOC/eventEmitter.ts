import {IEventEmiter} from '@corrbo/base/IOC/types';
import {EFlowEvents, IFlowReactions, IFlowReactionsData} from 'blms/types';

export class EventEmiter implements IEventEmiter {
  reactions: IFlowReactions = {}
  flowIds: Array<symbol> = []
  
  private state: {event: { name: EFlowEvents; data?: any } | null}  = {
    event: null
  }
  
  private proxy = new Proxy(this.state, {
    set: (obj: typeof this.state, prop: keyof typeof this.state, value:  typeof this.state['event']) => {
      if (prop === 'event' && value !== null && value.name) {
        this.onUpdate(value)
      }
      
      return true
    }
  })
  
  onUpdate(event: { name: EFlowEvents; data?: any }) {
    const func: any = this.reactions[event.name]
    
    if (func) {
      func(event.data)
    } else {
      console.log('Event function not found: ')
    }
  }
  
  emitEvent<EventName extends keyof IFlowReactionsData>(
    data: undefined extends IFlowReactionsData[EventName] ? {name: EventName} : {name: EventName, data: IFlowReactionsData[EventName]}
  ) {
    // @ts-ignore
    this.proxy.event = data
  }
  
  addFlowId(val: symbol): void {
    this.flowIds.push(val)
  }
  
  addReactions(val: IFlowReactions): void {
    this.reactions = val
  }
}
