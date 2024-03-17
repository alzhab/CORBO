export interface IRNCBaseController {
  init(): Promise<void>

  changeName(): Promise<void>
}
