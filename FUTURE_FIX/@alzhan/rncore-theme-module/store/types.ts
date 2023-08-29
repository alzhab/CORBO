import { IImages } from 'configs/Theme/images/types'
import { ColorsNames, IColors } from '../colors'

export interface IThemeStore {
  activeThemeName: ColorsNames
  changeTheme: (themeName: ColorsNames) => void

  colors: IColors
  images: IImages

  isHydrated: boolean
}
