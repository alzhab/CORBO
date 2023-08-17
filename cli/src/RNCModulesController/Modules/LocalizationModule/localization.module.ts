import { inject, injectable } from 'inversify'
import { ILocalizationModule } from './types'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import {
  LOCALIZATION_MODULE_BIND,
  LOCALIZATION_MODULE_CONFIG,
  LOCALIZATION_MODULE_DEPENDENCIES,
} from './constants'

export const LocalizationModuleId = Symbol.for('LocalizationModule')

// TODO добавление локали, input lang< -> перевод с en.translation -> [lang].translation
@injectable()
export class LocalizationModule implements ILocalizationModule {
  constructor(
    @inject(ValidatorsId)
    private validators: IValidators,
    @inject(BaseId)
    private base: IBase,
  ) {}

  async init(): Promise<void> {
    const stop = this.base.spinner()
    await this.base.installDependencies(LOCALIZATION_MODULE_DEPENDENCIES)
    this.base.copyToProject(LOCALIZATION_MODULE_CONFIG)
    this.base.insertoIntoProjectFile(LOCALIZATION_MODULE_BIND)
    stop()
  }
}
