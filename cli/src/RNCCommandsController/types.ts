export interface IRNCCommandsController {
  init(params: string[]): Promise<void>
}

export enum ECommands {
  // blm
  Blm = 'Blm',

  // ui
  Component = 'Component',
  Screen = 'Screen',

  // instruments
  Repository = 'Repository',
  Service = 'Service',
}

export enum EComponents {
  Atom = 'Atom',
  Molecule = 'Molecule',
  Organism = 'Organism',
  Template = 'Template',
}
