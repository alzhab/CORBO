import container from './IoC'
import { CliControllerId, ICliController } from './CliController'

const cliController = container.get<ICliController>(CliControllerId)

cliController.rnc(process.argv.slice(2))
