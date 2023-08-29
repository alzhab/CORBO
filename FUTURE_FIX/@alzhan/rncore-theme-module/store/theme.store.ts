import { makeAutoObservable } from 'mobx'
import { isHydrated, makePersistable } from 'mobx-persist-store'
import { injectable } from 'inversify'
import { IThemeStore } from './types'
import { IMAGES } from 'configs/Theme/images'
import {
  COLORS,
  ColorsNames,
  DEFAULT_COLORS_NAME,
} from '../index'

export const ThemeStoreId = Symbol.for('ThemeStore')

@injectable()
export class ThemeStore implements IThemeStore {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {
      name: 'ThemeStore',
      properties: ['activeThemeName'],
    })
  }

  activeThemeName: ColorsNames = DEFAULT_COLORS_NAME
  changeTheme(themeName: ColorsNames): void {
    this.activeThemeName = themeName
  }

  get colors() {
    return COLORS[this.activeThemeName]
  }

  get images() {
    return IMAGES[this.activeThemeName]
  }

  get isHydrated() {
    return isHydrated(this)
  }
}
