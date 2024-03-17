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
  IServiceCommands,
  ServiceCommands,
  ServiceCommandsId,
} from './Commands/ServiceCommands'
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
import {
  INavigationsSyncGenerator,
  NavigationsSyncGenerator,
  NavigationsSyncGeneratorId,
} from '../RNCGeneratorsController/NavigationsSync'

export const bindCommands = (container: Container) => {
  container
    .bind<IRNCCommandsController>(RNCCommandsControllerId)
    .to(RNCCommandsController)
  container.bind<IBlmCommands>(BlmCommandsId).to(BlmCommands)
  container.bind<IServiceCommands>(ServiceCommandsId).to(ServiceCommands)
  container.bind<IScreenCommands>(ScreenCommandsId).to(ScreenCommands)
  container
    .bind<IRepositoryCommands>(RepositoryCommandsId)
    .to(RepositoryCommands)
  container.bind<IComponentCommands>(ComponentCommandsId).to(ComponentCommands)
  container
    .bind<INavigationsSyncGenerator>(NavigationsSyncGeneratorId)
    .to(NavigationsSyncGenerator)
}
