import { Container } from 'inversify'
import { IAppFlow } from './types'
import { Flow, AppFlowId } from './flow'

function bindAppFlow(container: Container) {
  container.bind<IAppFlow>(AppFlowId).to(Flow)
}

export default bindAppFlow
