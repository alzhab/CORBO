export enum EAppEvents {
  APP_INIT = 'Запуск приложения',
}

export interface IAppFlow {
  init(): void
}
