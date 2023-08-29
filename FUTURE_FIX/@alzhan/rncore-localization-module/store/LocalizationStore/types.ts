import { LocaleCode } from 'services/Localization'

export interface ILocalizationStore {
  currentLocale: LocaleCode
  setCurrentLocale(val: LocaleCode): void

  isLocaleChosed: boolean
  setIsLocaleChoosed(val: boolean): void

  isHydrated: boolean
}
