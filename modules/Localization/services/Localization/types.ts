import { LocaleCode, Translation } from 'configs/Locales/types'

export interface ILocalization {
  currentLocale: LocaleCode
  changeLocale(locale: LocaleCode): void
  get<K extends keyof Translation>(key: K): Translation[K]
  get<K extends keyof Translation, V>(key: K, value: V): Translation[K]
}

export const REPLACE_VALUE = /\{\{.*\}\}/
