import en from 'configs/Locales/en.translations.json'

export enum LocaleCode {
  En = 'en',
}

export type Translation = typeof en

export type Locales = {
  [c in LocaleCode]: {
    name: string
    translation: Translation
  }
}

export const locales: Locales = {
  [LocaleCode.En]: {
    name: 'English',
    translation: en,
  },
}

export const DEFAULT_LOCALE = LocaleCode.En
