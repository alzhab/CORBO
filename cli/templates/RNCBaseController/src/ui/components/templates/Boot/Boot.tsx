import React, { FC, useEffect, useState } from 'react'
import { InteractionManager, Text } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { IBootProps } from './types'
import { observer } from 'mobx-react'

export const Boot: FC<IBootProps> = observer(({ hide }) => {
  const offset = useSharedValue(0)
  const [show, setShow] = useState(true)

  const animatedStyles = useAnimatedStyle(() => {
    const scale = interpolate(offset.value, [0, 1], [1, 5])
    const opacity = interpolate(offset.value, [0, 1], [1, 0])

    return {
      transform: [{ scale }],
      opacity,
    }
  })

  useEffect(() => {
    if (hide) {
      InteractionManager.runAfterInteractions(() => {
        offset.value = withTiming(1, {
          duration: 700,
          easing: Easing.inOut(Easing.quad),
        })
        setTimeout(() => {
          setShow(false)
        }, 800)
      })
    }
  }, [hide])

  return show ? (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: 2,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        },
        animatedStyles,
      ]}>
      <Text>Boot Module</Text>
    </Animated.View>
  ) : null
})
