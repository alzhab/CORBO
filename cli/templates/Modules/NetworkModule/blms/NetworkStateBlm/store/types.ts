export interface IMockRequestStatusesStore {
  showMockRequestDialog: boolean
  setShowMockRequestDialog(val: boolean): void

  statusButtons: IStatusButton[]
  setStatusButtons(val: IStatusButton[]): void
}

export interface IStatusButton {
  title: string
  val: any
  onPress: () => void
}
