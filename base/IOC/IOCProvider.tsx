import React, {FC, PropsWithChildren} from 'react';
import {Provider as InversifyProvider} from 'inversify-react';
import {Container} from 'inversify';
import {IAppEventsStore, IEventEmiter, TBindContainer} from './types';
import {AppEventsStore, AppEventsStoreId} from './store';
import {EventEmiter, EventEmiterId} from './eventEmitter';

const container = new Container({ defaultScope: 'Singleton' })

export function bindContainers(binders: TBindContainer[]): Container {
  container.bind<IAppEventsStore>(AppEventsStoreId).to(AppEventsStore)
  container.bind<IEventEmiter>(EventEmiterId).to(EventEmiter)

  binders.forEach(item => item(container))

  return container
}

export const eventEmiter = container.get<IEventEmiter>(EventEmiterId)

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
