import { inject, injectable } from 'inversify'
import { IMockRequestStatusesActions, IStatusButton } from './types'
import { IMockRequestStatusesStore, MockRequestStatusesStoreId } from '../store'

export const MockRequestStatusesActionsId = Symbol.for(
  'MockRequestStatusesActions',
)

@injectable()
export class MockRequestStatusesActions implements IMockRequestStatusesActions {
  constructor(
    @inject(MockRequestStatusesStoreId)
    private mockRequestStore: IMockRequestStatusesStore,
  ) {}

  closeStatusesDialog(): void {
    this.mockRequestStore.setShowMockRequestDialog(false)
    this.mockRequestStore.setStatusButtons([])
  }

  openStatusesDialog(data: IStatusButton[]): void {
    this.mockRequestStore.setShowMockRequestDialog(true)
    this.mockRequestStore.setStatusButtons(data)
  }
}
