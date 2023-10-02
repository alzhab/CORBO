import React, { FC } from 'react'
import { Pressable } from 'react-native'
import { IIconProps } from '../types';
import { useIconSizes } from '../hooks';
import Svg from 'react-native-svg'
import { Spacings, useSpacings } from '@corrbo/module-spacing-props'

export const baseIcon = (
  Component: FC<IIconProps & Spacings>,
  baseWidth: number,
  baseHeight: number,
) => {
  return (props: IIconProps & Spacings) => {
    const { margin, padding } = useSpacings(props)

    const { width, height } = useIconSizes({
      baseWidth,
      baseHeight,
      size: props.size,
      sizeType: props.sizeType,
    })

    return (
      <Pressable
        onPress={props.onPress}
        style={[props.pressableStyle, margin, padding]}>
        <Svg
          width={width}
          height={height}
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          style={props.style}
          fill={'none'}>
          <Component {...props} />
        </Svg>
      </Pressable>
    )
  }
}
