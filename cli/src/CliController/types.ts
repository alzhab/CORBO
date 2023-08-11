export interface ICliController {
  rnc(options: string[]): void
}

export enum ECliVariants {
  Modules = 'Modules',
  Commands = 'Commands',
  UILibs = 'UI libs',
  Generators = 'Generators',
}
