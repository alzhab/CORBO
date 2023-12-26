export interface IBlmCommands {
  init(params: string[]): Promise<void>
}

export enum EBlmVariants {
  store = 'store',
  flow = 'flow',
  action = 'action',
  uiAdapter = 'ui-adapter',
}

export const VARIANT_OPTIONS: { [key: string]: EBlmVariants } = {
  a: EBlmVariants.action,
  f: EBlmVariants.flow,
  u: EBlmVariants.uiAdapter,
  s: EBlmVariants.store,
}
