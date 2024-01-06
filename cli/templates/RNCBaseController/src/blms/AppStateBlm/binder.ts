import { Container } from 'inversify'
import { IAppState, AppStateFlow, AppStateFlowId } from './flow'

export const bindAppStateBlm = (container: Container) => {
  container.bind<IAppState>(AppStateFlowId).to(AppStateFlow)
}
