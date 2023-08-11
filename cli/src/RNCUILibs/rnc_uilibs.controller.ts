import { EUILibs, IRNCUILibs } from './types'
import { inject, injectable } from 'inversify'
import {
  IReactNativeElements,
  ReactNativeElementsId,
} from './UILibs/ReactNativeElements'
import inquirer from 'inquirer'

export const RNCUILibsId = Symbol.for('RNCUILibsId')

@injectable()
export class RNCUILibs implements IRNCUILibs {
  constructor(
    @inject(ReactNativeElementsId)
    private ReactNativeElements: IReactNativeElements,
  ) {}

  uilibs: { [key in EUILibs]: () => Promise<void> } = {
    [EUILibs.ReactNativeElements]: () => this.ReactNativeElements.init(),
    [EUILibs.ReactNativePaper]: () => {
      console.log('ReactNativePaper')
      return Promise.resolve()
    },
  }

  disabledUILibs: { [key in EUILibs]: boolean } = {
    [EUILibs.ReactNativeElements]: false,
    [EUILibs.ReactNativePaper]: false,
  }

  async init(): Promise<void> {
    const uilib: EUILibs = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'uilib',
          message: 'Choose UI lib',
          choices: (Object.keys(EUILibs) as Array<keyof typeof EUILibs>).map(
            key => ({
              value: EUILibs[key],
              name: EUILibs[key],
              disabled: this.disabledUILibs[EUILibs[key]],
            }),
          ),
        },
      ])
      .then(res => res.uilib)

    await this.uilibs[uilib]()
  }
}
