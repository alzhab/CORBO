import { useMemo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { EdgeInsets } from 'react-native-safe-area-context/src/SafeArea.types'
import { IColors, useTheme } from '../../index'

export type ICreateStyles<Props = {}> = ({
  colors,
  edges,
  props,
}: {
  colors: IColors
  edges: EdgeInsets
  props?: Props
}) => any

export function useStyles<Props>(
  createStyles: ICreateStyles<Props>,
  props?: Props,
) {
  const { colors } = useTheme()
  const edges = useSafeAreaInsets()

  return useMemo(
    () => createStyles({ colors, edges, props }),
    [colors, edges, props],
  )
}
