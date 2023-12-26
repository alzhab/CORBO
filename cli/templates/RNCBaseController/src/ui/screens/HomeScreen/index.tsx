import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react'
import { InteractionManager, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { useHideBoot } from '@corrbo/base/AppEventsModule'

export const HomeScreen = observer(() => {
  const [isRendered, setIsRendered] = useState(false)
  const { hideBoot } = useHideBoot()

  useFocusEffect(
    useCallback(() => {
      if (hideBoot) {
        const task = InteractionManager.runAfterInteractions(() => {
          setIsRendered(true)
        })

        return () => {
          task.cancel()
        }
      }
    }, [hideBoot]),
  )

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isRendered && (
        <Animated.Text entering={ZoomIn.delay(500)} style={{ fontSize: 30 }}>
          Home Screen
        </Animated.Text>
      )}
    </View>
  )
})
