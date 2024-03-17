import { IValidName } from '../../../Validators'
import { ICreateFileInProject } from '../../../Base'
import { SCREEN_FILE } from './templates'

export const SCREEN_FOLDER_PATH = '/src/ui/screens'

export const SCREEN_CONFIG: (data: IValidName) => ICreateFileInProject[] = (
  data: IValidName,
) => [
  {
    path: data.folderPath + '/index.tsx',
    content: SCREEN_FILE(data),
  },
]
