import { inject, injectable } from 'inversify'
import { IFlowCommands } from './types'
import { BaseId, IBase } from '../../../Base'
import { IValidators, ValidatorsId } from '../../../Validators'
import { FLOW_CREATE_EVENT } from './constants'

export const FlowCommandsId = Symbol.for('FlowCommands')

@injectable()
export class FlowCommands implements IFlowCommands {
  constructor(
    @inject(BaseId) private base: IBase,
    @inject(ValidatorsId) private validators: IValidators,
  ) {}
  async init(): Promise<void> {
    const data = await this.validators.getValidEventName()
    this.base.insertoIntoProjectFile(FLOW_CREATE_EVENT(data))
  }
}
