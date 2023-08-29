import { useInjection } from 'inversify-react'

import { useMemo } from 'react'

interface BaseStore {
  isHydrated: boolean
}

export const useIsStoresHydrated = (storesIds: symbol[]) => {
  const storesMap = storesIds.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    item => useInjection<BaseStore>(item).isHydrated,
  )

  return useMemo(() => storesMap.every(item => item), [storesMap])
}
