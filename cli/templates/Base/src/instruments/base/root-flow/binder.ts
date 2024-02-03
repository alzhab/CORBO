import { Container } from 'inversify'
import { IRootFlow } from './types'
import { RootFlow, RootFlowId } from './root-flow'

export function bindRootFlow(container: Container) {
  container.bind<IRootFlow>(RootFlowId).to(RootFlow)
}
