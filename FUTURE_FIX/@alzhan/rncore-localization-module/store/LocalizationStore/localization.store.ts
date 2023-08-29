import { makeAutoObservable } from 'mobx'
import { isHydrated, makePersistable } from 'mobx-persist-store'
import { injectable } from 'inversify'
import { ILocalizationStore } from './types'
import { LocaleCode, DEFAULT_LOCALE } from 'configs/Locales/types'

export const LocalizationStoreId = Symbol.for('LocalizationStore')

@injectable()
export class LocalizationStore implements ILocalizationStore {
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {
      name: 'LocalizationStore',
      properties: ['currentLocale', 'isLocaleChosed'],
    })
  }

  currentLocale: LocaleCode = DEFAULT_LOCALE
  setCurrentLocale(val: LocaleCode): void {
    this.currentLocale = val
  }

  isLocaleChosed: boolean = false
  setIsLocaleChoosed(val: boolean): void {
    this.isLocaleChosed = val
  }

  get isHydrated() {
    return isHydrated(this)
  }
}
