export interface IComponentCommands {
  init(): Promise<void>
}

export enum EComponentTypes {
  atoms = 'atoms',
  molecules = 'molecules',
  organisms = 'organisms',
  templates = 'templates',
}
