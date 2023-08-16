import { inject, injectable } from 'inversify'
import { ENetworkType, INetworkModule } from './types'
import { BaseId, IBase } from '../../../Base'
import { IValidators, ValidatorsId } from '../../../Validators'
import inquirer from 'inquirer'
import chalk from 'chalk'
import {
  NETWORK_MODULE_BIND_AXIOS,
  NETWORK_MODULE_BIND_MOCK,
  NETWORK_MODULE_DEPENDENCIES_AXIOS,
  NETWORK_MODULE_DEV_DEPENDENCIES_MOCK,
  NETWORK_MODULE_INSERT_AXIOS,
  NETWORK_MODULE_INSERT_MOCK,
} from './constants'

export const NetworkModuleId = Symbol.for('NetworkModuleId')

@injectable()
export class NetworkModule implements INetworkModule {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}

  types: { [key in ENetworkType]: () => Promise<void> } = {
    [ENetworkType.REST]: () => this.axiosInit(),
    [ENetworkType.GRAPHQL]: () => {
      console.log(chalk.yellow('In progress...'))
      return Promise.resolve()
    },
    [ENetworkType.SOAP]: () => {
      console.log(chalk.yellow('In progress...'))
      return Promise.resolve()
    },
    [ENetworkType.GRPC]: () => {
      console.log(chalk.yellow('In progress...'))
      return Promise.resolve()
    },
  }

  async init(): Promise<void> {
    const type = await inquirer
      .prompt([
        {
          message: 'Network Type:',
          choices: (
            Object.keys(ENetworkType) as Array<keyof typeof ENetworkType>
          ).map(key => ({
            value: ENetworkType[key],
            name: ENetworkType[key],
          })),
          type: 'list',
          name: 'type',
        },
      ])
      .then(res => res.type)

    await this.types[type as ENetworkType]()
  }

  async axiosInit() {
    const installMock = await inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'installMock',
          message: `Do you need to install MOCK module ?`,
        },
      ])
      .then(res => res.installMock)

    if (installMock) {
      await this.installMockModule()
    }

    this.base.copyToProject(NETWORK_MODULE_INSERT_AXIOS)
    this.base.insertoIntoProjectFile(NETWORK_MODULE_BIND_AXIOS)
    this.base.installDependencies(NETWORK_MODULE_DEPENDENCIES_AXIOS)
    this.base.updateEnv({ SERVER_URL: 'http:example-api.com' })
  }

  async installMockModule() {
    this.base.copyToProject(NETWORK_MODULE_INSERT_MOCK)
    this.base.insertoIntoProjectFile(NETWORK_MODULE_BIND_MOCK)
    this.base.installDependencies(NETWORK_MODULE_DEV_DEPENDENCIES_MOCK)
  }
}
