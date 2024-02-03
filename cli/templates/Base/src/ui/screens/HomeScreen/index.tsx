import React from 'react';
import {observer} from 'mobx-react';
import {View} from 'react-native';
import Animated, {ZoomIn} from 'react-native-reanimated';

export const HomeScreen = observer(() => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.Text entering={ZoomIn.delay(500)} style={{ fontSize: 30 }}>
        Home Screen
      </Animated.Text>
    </View>
  )
})
