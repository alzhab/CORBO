import {useMemo} from 'react';
import {useInjection} from 'inversify-react';
import {AppEventsStoreId, IAppEventsStore} from '../store';
import {useInitialScreenAdapter} from '@corrbo/base/NavigationModule';
import {IInitialRouteStore, InitialRouteStoreId} from '@corrbo/base/NavigationModule/blms/store';

export const useHideBootAdapter = () => {
  const store =
    useInjection<IInitialRouteStore>(InitialRouteStoreId)
  const { isNavigationReady } = useInitialScreenAdapter()
  
  const isAppInitialized = useMemo(
    () => !!store.initialScreen,
    [store.initialScreen],
  )
  
  const hideBoot = useMemo(() => isAppInitialized  && isNavigationReady, [
    isAppInitialized, isNavigationReady
  ])
  
 
  return {
    hideBoot
  }
}
