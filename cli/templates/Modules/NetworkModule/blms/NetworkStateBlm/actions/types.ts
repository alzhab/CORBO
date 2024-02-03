export interface IMockRequestStatusesActions {
  openStatusesDialog(data: IStatusButton[]): void
  closeStatusesDialog(): void
}

export interface IStatusButton {
  title: string
  val: any
  onPress: () => void
}
