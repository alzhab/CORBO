import { useInjection } from 'inversify-react'
import { useMemo } from 'react'
import { BootStoreId, IBootStore } from '../../stores'

export function useBootBlm() {
  const bootStore = useInjection<IBootStore>(BootStoreId)

  const hideBoot = useMemo(() => bootStore.hideBoot, [bootStore.hideBoot])

  return {
    hideBoot,
  }
}
