import { useMemo } from 'react'
import { Spacings } from './types'
import { DimensionValue } from 'react-native'

export const useSpacings = (props: Spacings): {margin: {
    marginTop: DimensionValue | undefined
    marginBottom: DimensionValue | undefined
    marginLeft: DimensionValue | undefined
    marginRight: DimensionValue | undefined
  }, padding: {
    paddingTop: DimensionValue | undefined
    paddingBottom: DimensionValue | undefined
    paddingLeft: DimensionValue | undefined
    paddingRight: DimensionValue | undefined
  }} => {
  const margin = useMemo(
    () => ({
      marginTop: props.marginT || props.marginVer,
      marginBottom: props.marginB || props.marginVer,
      marginLeft: props.marginL || props.marginHor,
      marginRight: props.marginR || props.marginHor,
    }),
    [
      props.marginT,
      props.marginB,
      props.marginL,
      props.marginR,
      props.marginHor,
      props.marginVer,
    ],
  )

  const padding = useMemo(
    () => ({
      paddingTop: props.paddingT || props.paddingVer,
      paddingBottom: props.paddingB || props.paddingVer,
      paddingLeft: props.paddingL || props.paddingHor,
      paddingRight: props.paddingR || props.paddingHor,
    }),
    [
      props.paddingT,
      props.paddingB,
      props.paddingL,
      props.paddingR,
      props.paddingHor,
      props.paddingVer,
    ],
  )

  return { margin, padding }
}
