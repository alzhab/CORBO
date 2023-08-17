export interface IComponentCommands {
  init(params: string[]): Promise<void>
}

export enum EComponentTypes {
  atoms = 'atoms',
  molecules = 'molecules',
  organisms = 'organisms',
  templates = 'templates',
}
