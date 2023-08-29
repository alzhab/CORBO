import { inject, injectable } from 'inversify'
import { ILocalization, REPLACE_VALUE } from './types'
import {
  LocalizationStore,
  LocalizationStoreId,
} from '../../store'
import { LocaleCode, locales, Translation } from 'configs/Locales/types'

export const LocalizationId = Symbol.for('Localization')

@injectable()
export class Localization implements ILocalization {
  constructor(
    @inject(LocalizationStoreId) private _localizationStore: LocalizationStore,
  ) {}

  changeLocale(locale: LocaleCode): void {
    this._localizationStore.setCurrentLocale(locale)
  }

  get currentLocale(): LocaleCode {
    return this._localizationStore.currentLocale
  }

  get t() {
    return locales[this._localizationStore.currentLocale as LocaleCode]
      .translation
  }

  get = <K extends keyof Translation, V>(key: K, value?: V) => {
    if (this.t[key]) {
      return value
        ? (this.t[key] as string).replace(REPLACE_VALUE, value.toString())
        : this.t[key]
    } else {
      return ''
    }
  }
}
