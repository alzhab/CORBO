export interface IRNCGeneratorsController {
  init(params: string[]): Promise<void>
}

export enum EGenerators {
  Api = 'Api',
}
