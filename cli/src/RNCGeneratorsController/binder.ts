import { Container } from 'inversify'
import { ApiGenerator, ApiGeneratorId, IApiGenerator } from './API'
import {
  RNCGeneratorsController,
  RNCGeneratorsControllerId,
} from './rnc_generators.controller'
import { IRNCGeneratorsController } from './types'

export const bindGenerators = (container: Container) => {
  container
    .bind<IRNCGeneratorsController>(RNCGeneratorsControllerId)
    .to(RNCGeneratorsController)
  container.bind<IApiGenerator>(ApiGeneratorId).to(ApiGenerator)
}
