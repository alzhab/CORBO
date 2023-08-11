import { IBootModule } from './types'
import { inject, injectable } from 'inversify'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import {
  BOOT_MODULE_BIND,
  BOOT_MODULE_CONFIG,
  BOOT_MODULE_DEPENDENCIES,
  BOOT_MODULE_FLOW_CONFIG,
} from './constants'

export const BootModuleId = Symbol.for('BootModule')

@injectable()
export class BootModule implements IBootModule {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}

  async init(): Promise<void> {
    const stop = this.base.spinner()
    this.base.installDependencies(BOOT_MODULE_DEPENDENCIES)
    this.base.copyToProject(BOOT_MODULE_CONFIG)
    this.base.insertoIntoProjectFile([
      ...BOOT_MODULE_BIND,
      ...BOOT_MODULE_FLOW_CONFIG,
    ])
    stop()
  }
}
