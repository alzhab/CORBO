export interface IRNCCommandsController {
  init(params: string[]): Promise<void>
}

export enum ECommands {
  // BusinessLogic
  Flow = 'Flow',
  Blm = 'BLM',
  Store = 'Store',

  // UI
  Component = 'Component',
  Screen = 'Screen',

  // Instruments
  Repository = 'Repository',
  Service = 'Service',
}

export enum EComponents {
  Atom = 'Atom',
  Molecule = 'Molecule',
  Organism = 'Organism',
  Template = 'Template',
}
