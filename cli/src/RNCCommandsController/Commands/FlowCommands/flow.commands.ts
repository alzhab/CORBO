import { inject, injectable } from 'inversify'
import { IFlowCommands } from './types'
import { BaseId, IBase, IInsertoIntoProjectFileParams } from '../../../Base'
import { IValidators, ValidatorsId } from '../../../Validators'
import { FLOW_CREATE_EVENT } from './constants'

export const FlowCommandsId = Symbol.for('FlowCommands')

@injectable()
export class FlowCommands implements IFlowCommands {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}
  async init(params: string[]): Promise<void> {
    let data: IInsertoIntoProjectFileParams[][] = []

    if (params[0]) {
      const names = params[0].split(',')
      data = await Promise.all(names.map(this.createData.bind(this)))
    } else {
      const res = await this.createData()
      data.push(res)
    }

    this.base.insertoIntoProjectFile(data.flat())
  }

  async createData(name?: string): Promise<IInsertoIntoProjectFileParams[]> {
    const data = await this.validators.getValidEventName(name)
    return FLOW_CREATE_EVENT(data)
  }
}
