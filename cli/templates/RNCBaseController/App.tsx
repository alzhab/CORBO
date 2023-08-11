import React from 'react'
import EntryPoint from './src/EntryPoint'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Platform, UIManager } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { IOCProvider } from '@alzhan/rncore-base/IOCModule'
import { BINDERS } from './src/binders'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <IOCProvider binders={BINDERS}>
          <EntryPoint />
        </IOCProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
