import { Container } from 'inversify'
import { AppStateFlow, AppStateFlowId, IAppState } from './flow'

export const bindAppStateBlm = (container: Container) => {
  container.bind<IAppState>(AppStateFlowId).to(AppStateFlow)
}
