import {useInjection} from 'inversify-react';
import {ILocalizationStore, LocalizationStoreId} from '@corrbo/module-localization';
import {LocaleCode, locales, Translation} from 'configs/Locales/types';
import {REPLACE_VALUE} from '@corrbo/module-localization/services/Localization/types';
import {useCallback, useMemo} from 'react';

export const useTranslation = () => {
  const store = useInjection<ILocalizationStore>(LocalizationStoreId)
  
  const changeLocale = (locale: LocaleCode) => {
    store.setCurrentLocale(locale)
  }
  
  const currentLocale = useMemo(() => {
    return store.currentLocale
  }, [store.currentLocale])
  
  const t = useMemo(() => {
    return locales[store.currentLocale as LocaleCode]
      .translation
  }, [store.currentLocale])
  
  const get = useCallback(<K extends keyof Translation, V>(key: K, value?: V) => {
    if (t[key]) {
      return value
        ? (t[key] as string).replace(REPLACE_VALUE, value.toString())
        : t[key]
    } else {
      return ''
    }
  }, [t])
  
  return {
    changeLocale,
    currentLocale,
    t,
    get
  }
}
