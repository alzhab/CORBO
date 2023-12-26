import {useMemo} from 'react';
import {useInjection} from 'inversify-react';
import {AppEventsStoreId, IAppEventsStore} from '../store';
import {useInitialScreenAdapter} from '@corrbo/base/NavigationModule';

export const useHideBootAdapter = () => {
  const store = useInjection<IAppEventsStore>(AppEventsStoreId)
  const { isNavigationReady } = useInitialScreenAdapter()
  
  const isAppInitialized = useMemo(
    () => store.isAppInitialized,
    [store.isAppInitialized],
  )
  
  const hideBoot = useMemo(() => isAppInitialized  && isNavigationReady, [
    isAppInitialized, isNavigationReady
  ])
  
 
  return {
    hideBoot
  }
}
