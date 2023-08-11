export interface IRNCUILibs {
  init(): Promise<void>
}

export enum EUILibs {
  ReactNativeElements = 'ReactNativeElements',
  ReactNativePaper = 'ReactNativePaper',
}
