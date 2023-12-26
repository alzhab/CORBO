import { IInsertoIntoProjectFileParams } from '../../../Base'
import { IValidEventName } from '../../../Validators'

export const FLOW_FOLDER_PATH = '/src/blm/root-flow'

export const FLOW_CREATE_EVENT: (
  data: IValidEventName,
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
    path: FLOW_FOLDER_PATH + '/types.ts',
    text: `  [EAppEvents.${transformedName}]: undefined,`,
    searchRegex: /export type IAppEventsData = \{/,
    type: 'after',
  },
  {
    path: FLOW_FOLDER_PATH + '/app-app-app-events.flow.ts',
    text: `[EAppEvents.${transformedName}]: this.${functionName}.bind(this),`,
    searchRegex: /\[EAppEvents.APP_INIT\]: this.onAppInit,/,
    type: 'after',
  },
  {
    path: FLOW_FOLDER_PATH + '/app-app-app-events.flow.ts',
    text: `${functionName}(){}`,
    searchRegex: /onAppInit\(\) \{/,
    type: 'before',
  },
]
