import { IReactNativeElements } from './types'
import { inject, injectable } from 'inversify'
import { IValidators, ValidatorsId } from '../../../Validators'
import { BaseId, IBase } from '../../../Base'
import shell from 'shelljs'

export const ReactNativeElementsId = Symbol.for('ReactNativeElements')

@injectable()
export class ReactNativeElements implements IReactNativeElements {
  constructor(
    @inject(ValidatorsId) private validators: IValidators,
    @inject(BaseId) private base: IBase,
  ) {}

  async init(): Promise<void> {
    await this.base.installDependencies([
      '@rneui/themed',
      '@rneui/base',
      'react-native-vector-icons',
    ])
  }
}
