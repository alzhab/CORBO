import { useCallback, useMemo } from 'react'
import { useInjection } from 'inversify-react'
import { IThemeStore, ThemeStoreId } from '../../store'
import { ColorsNames } from '../../colors'

export const useTheme = () => {
  const theme = useInjection<IThemeStore>(ThemeStoreId)

  const colors = useMemo(() => theme.colors, [theme.colors])
  const images = useMemo(() => theme.images, [theme.images])
  const activeThemeName = useMemo(
    () => theme.activeThemeName,
    [theme.activeThemeName],
  )
  const changeTheme = useCallback(
    (val: ColorsNames) => theme.changeTheme(val),
    [],
  )
  const navigationColors = useMemo(() => {
    return {
      dark: false,
      colors: {
        primary: colors.navigation_primary,
        background: colors.navigation_background,
        card: colors.navigation_card,
        text: colors.navigation_text,
        border: colors.navigation_border,
        notification: colors.navigation_notification,
      },
    }
  }, [
    colors.navigation_primary,
    colors.navigation_background,
    colors.navigation_card,
    colors.navigation_text,
    colors.navigation_border,
    colors.navigation_notification,
  ])

  return {
    colors,
    images,
    activeThemeName,
    changeTheme,
    navigationColors,
  }
}
