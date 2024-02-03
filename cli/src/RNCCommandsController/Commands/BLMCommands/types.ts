import { TCommandReturn } from '../../../types'

export interface IBlmCommands {
  init(): Promise<TCommandReturn>
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
