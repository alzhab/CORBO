import React, {FC, PropsWithChildren} from 'react';
import {Provider as InversifyProvider, useInjection} from 'inversify-react';
import {Container} from 'inversify';
import {TBindContainer} from './types';
import {EventEmiter} from './eventEmitter';
import {EAppStateFlowEvents} from 'blms/AppStateBlm/flow';
import {IBaseFlow} from '@corrbo/base/IOC';
import {IFlowReactions} from 'blms/types';

export const EVENT_EMITTER = new EventEmiter()

const container = new Container({ defaultScope: 'Singleton' })

export function bindContainers(binders: TBindContainer[]): Container {
  binders.forEach(item => item(container))
  
  const reactions = EVENT_EMITTER.flowIds.reduce((res, flowId) => {
    const reactions = container.get<IBaseFlow>(flowId).reactions
    
    res = {
      ...res,
      ...reactions
    }
    
    return res
  }, [] as IFlowReactions)
  
  EVENT_EMITTER.addReactions(reactions)
  
  return container
}

export const IOCProvider: FC<
  PropsWithChildren<{
    binders: ((container: Container) => void)[]
  }>
> = ({ children, binders }) => {
  return (
    <InversifyProvider container={() => bindContainers(binders)}>
      {children}
    </InversifyProvider>
  )
}
