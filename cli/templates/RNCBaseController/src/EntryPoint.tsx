import React from 'react'
import { observer } from 'mobx-react'
import { Navigation } from 'navigations/Navigation'
import { StatusBar } from 'react-native'
import { useInitAppAdapter } from '@corrbo/base/AppEventsModule'
import { Boot } from 'templates/Boot'
import { HYDRATED_STORES } from './blms/hydrated-stores'

const App = observer(() => {
  return <Navigation />
})

const EntryPoint = observer(() => {
  const { isAppInitialized, hideBoot } = useInitAppAdapter(HYDRATED_STORES)

  return (
    <>
      <StatusBar />

      {isAppInitialized && <App />}

      <Boot hide={hideBoot} />
    </>
  )
})

export default EntryPoint
