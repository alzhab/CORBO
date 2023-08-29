import React from 'react';
import {observer} from 'mobx-react';
import {useInitApp} from 'hooks/useInitApp';
import {Navigation} from 'navigations/Navigation';
import {HYDRATED_STORES} from './binders';

const App = observer(() => {
  return (
    <>
      <Navigation />
    </>
  )
})

const EntryPoint = observer(() => {
  const { isAppInitialized } = useInitApp(HYDRATED_STORES)
  
  return isAppInitialized ? <App /> : <></>
})

export default EntryPoint
