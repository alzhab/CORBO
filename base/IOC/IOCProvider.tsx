import React, { FC, PropsWithChildren } from 'react'
import { Provider as InversifyProvider } from 'inversify-react'
import { Container } from 'inversify'
import { TBindContainer } from './types'

export function bindContainers(binders: TBindContainer[]): Container {
  binders = [...binders]
  const container = new Container({ defaultScope: 'Singleton' })

  binders.forEach(item => item(container))
  // Init services data

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
