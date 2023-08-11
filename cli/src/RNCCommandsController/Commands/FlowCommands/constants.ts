import { IInsertoIntoProjectFileParams } from '../../../Base'
import { IValideEventName } from '../../../Validators'

export const FLOW_FOLDER_PATH = '/src/BusinessLogic/flow'

export const FLOW_CREATE_EVENT: (
  data: IValideEventName,
) => IInsertoIntoProjectFileParams[] = ({
  name,
  transformedName,
  functionName,
}) => [
  {
    path: FLOW_FOLDER_PATH + '/types.ts',
    text: `${transformedName} = '${name}',`,
    searchRegex: /export enum EAppEvents \{/,
    type: 'after',
  },
  {
    path: FLOW_FOLDER_PATH + '/flow.ts',
    text: `[EAppEvents.${transformedName}]: this.${functionName}.bind(this),`,
    searchRegex: /\[EAppEvents.APP_INIT\]: this.onAppInit.bind\(this\),/,
    type: 'after',
  },
  {
    path: FLOW_FOLDER_PATH + '/flow.ts',
    text: `${functionName}(){}`,
    searchRegex: /onAppInit\(\) \{/,
    type: 'before',
  },
]
