import { IValideName } from '../../../Validators'
import { ICreateFileInProject } from '../../../Base'
import { SCREEN_FILE } from '../../../../templates/Commands/ScreenCommands/constants'

export const SCREEN_FOLDER_PATH = '/src/UI/screens'

export const SCREEN_CONFIG: (data: IValideName) => ICreateFileInProject[] = (
  data: IValideName,
) => [
  {
    path: SCREEN_FOLDER_PATH + '/' + data.folderName + '/index.tsx',
    content: SCREEN_FILE(data),
  },
]
