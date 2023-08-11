import container from './IoC'
import { CliControllerId, ICliController } from './CliController'

const commandsController = container.get<ICliController>(CliControllerId)

commandsController.rnc(process.argv.slice(2))
