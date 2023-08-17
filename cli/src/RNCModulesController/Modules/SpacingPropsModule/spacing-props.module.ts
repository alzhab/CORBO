import { inject, injectable } from 'inversify'
import { ISpacingPropsModule } from './types'
import { BaseId, IBase } from '../../../Base'
import { IValidators, ValidatorsId } from '../../../Validators'
import { SPACING_PROPS_DEPENDENCIES } from './constants'
import inquirer from 'inquirer'

export const SpacingPropsModuleId = Symbol.for('SpacingPropsModuleId')

@injectable()
export class SpacingPropsModule implements ISpacingPropsModule {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}

  async init(): Promise<void> {
    await this.base.installDependencies(SPACING_PROPS_DEPENDENCIES)
  }

  async checkInstall(): Promise<boolean> {
    if (!this.validators.isSpacingPropsModuleInitialized) {
      const approve = await inquirer
        .prompt([
          {
            name: 'approve',
            message: 'Do you want to install Spacing Props Module ?',
            type: 'confirm',
          },
        ])
        .then(res => res.approve)

      if (approve) {
        await this.init()
      }

      return approve
    } else {
      return Promise.resolve(true)
    }
  }
}
