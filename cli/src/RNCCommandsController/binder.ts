import { Container } from 'inversify'
import { IRNCCommandsController } from './types'
import {
  RNCCommandsController,
  RNCCommandsControllerId,
} from './rnc_commands.controller'
import {
  BlmCommands,
  BlmCommandsId,
  IBlmCommands,
} from './Commands/BLMCommands'
import {
  IStoreCommands,
  StoreCommands,
  StoreCommandsId,
} from './Commands/StoreCommands'
import {
  IServiceCommands,
  ServiceCommands,
  ServiceCommandsId,
} from './Commands/ServiceCommands'
import {
  FlowCommands,
  FlowCommandsId,
  IFlowCommands,
} from './Commands/FlowCommands'
import {
  IScreenCommands,
  ScreenCommands,
  ScreenCommandsId,
} from './Commands/ScreenCommands'
import {
  IRepositoryCommands,
  RepositoryCommands,
  RepositoryCommandsId,
} from './Commands/RepositoryCommands'
import {
  ComponentCommands,
  ComponentCommandsId,
  IComponentCommands,
} from './Commands/ComponentCommands'

export const bindCommands = (container: Container) => {
  container
    .bind<IRNCCommandsController>(RNCCommandsControllerId)
    .to(RNCCommandsController)
  container.bind<IBlmCommands>(BlmCommandsId).to(BlmCommands)
  container.bind<IStoreCommands>(StoreCommandsId).to(StoreCommands)
  container.bind<IServiceCommands>(ServiceCommandsId).to(ServiceCommands)
  container.bind<IFlowCommands>(FlowCommandsId).to(FlowCommands)
  container.bind<IScreenCommands>(ScreenCommandsId).to(ScreenCommands)
  container
    .bind<IRepositoryCommands>(RepositoryCommandsId)
    .to(RepositoryCommands)
  container.bind<IComponentCommands>(ComponentCommandsId).to(ComponentCommands)
}
