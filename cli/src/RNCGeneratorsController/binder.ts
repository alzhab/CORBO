import { Container } from 'inversify'
import { ApiGenerator, ApiGeneratorId, IApiGenerator } from './API'
import {
  RNCGeneratorsController,
  RNCGeneratorsControllerId,
} from './rnc_generators.controller'
import { IRNCGeneratorsController } from './types'
import {
  AppIconGenerator,
  AppIconGeneratorId,
  IAppIconGenerator,
} from './AppIcon'
import { IconsGenerator, IconsGeneratorId, IIconsGenerator } from './Icons'

export const bindGenerators = (container: Container) => {
  container
    .bind<IRNCGeneratorsController>(RNCGeneratorsControllerId)
    .to(RNCGeneratorsController)
  container.bind<IApiGenerator>(ApiGeneratorId).to(ApiGenerator)
  container.bind<IAppIconGenerator>(AppIconGeneratorId).to(AppIconGenerator)
  container.bind<IIconsGenerator>(IconsGeneratorId).to(IconsGenerator)
}
