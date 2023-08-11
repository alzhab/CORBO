import 'reflect-metadata'
import { Container } from 'inversify'

import {
  IRNCBaseController,
  RNCbaseController,
  RNCBaseControllerId,
} from './RNCBaseController'
import { CliController, CliControllerId, ICliController } from './CliController'
import { IValidators, Validators, ValidatorsId } from './Validators'
import { Base, BaseId, IBase } from './Base'
import { bindModules } from './RNCModulesController/binder'
import { bindCommands } from './RNCCommandsController'
import { bindUILibs } from './RNCUILibs'

const container = new Container({ defaultScope: 'Singleton' })

container.bind<IBase>(BaseId).to(Base)
container.bind<IValidators>(ValidatorsId).to(Validators)

container.bind<IRNCBaseController>(RNCBaseControllerId).to(RNCbaseController)
container.bind<ICliController>(CliControllerId).to(CliController)

bindModules(container)
bindCommands(container)
bindUILibs(container)

export default container
