import { Container } from 'inversify'
import { IThemeStore, ThemeStore, ThemeStoreId } from './store'

export const bindThemeModule = (container: Container) => {
  container.bind<IThemeStore>(ThemeStoreId).to(ThemeStore)
}
