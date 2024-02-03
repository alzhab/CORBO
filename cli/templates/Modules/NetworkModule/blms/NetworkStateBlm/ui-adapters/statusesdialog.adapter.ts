import { useInjection } from 'inversify-react'
import { useCallback, useMemo } from 'react'
import { IMockRequestStatusesStore, MockRequestStatusesStoreId } from '../store'
import {
  IMockRequestStatusesActions,
  MockRequestStatusesActionsId,
} from '../actions'

export function useStatusesDialogAdapter() {
  const store = useInjection<IMockRequestStatusesStore>(
    MockRequestStatusesStoreId,
  )
  const actions = useInjection<IMockRequestStatusesActions>(
    MockRequestStatusesActionsId,
  )

  const isOpen = useMemo(
    () => store.showMockRequestDialog,
    [store.showMockRequestDialog],
  )
  const buttons = useMemo(() => store.statusButtons, [store.statusButtons])

  const close = useCallback(() => actions.closeStatusesDialog(), [])

  return {
    isOpen,
    close,
    buttons,
  }
}
