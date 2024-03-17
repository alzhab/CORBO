export interface ICliController {
  rnc(): void
}

export enum ECliVariants {
  Modules = 'Modules',
  Commands = 'Commands',
  Generators = 'Generators',
}
