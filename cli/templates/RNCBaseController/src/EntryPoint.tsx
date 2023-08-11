import React from 'react'
import { observer } from 'mobx-react'
import { useInitApp } from 'hooks/useInitApp'
import { Navigation } from 'navigations/Navigation'
import { HYDRATED_STORES } from './binders';

const EntryPoint = observer(() => {
  useInitApp(HYDRATED_STORES)

  return <Navigation />
})

export default EntryPoint
