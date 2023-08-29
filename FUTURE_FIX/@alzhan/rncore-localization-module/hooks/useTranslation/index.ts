import { useInjection } from 'inversify-react'
import { ILocalization, LocalizationId } from '../../services'

export const useTranslation = () => {
  return useInjection<ILocalization>(LocalizationId)
}
