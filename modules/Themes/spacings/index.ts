import { CONFIG as config } from 'configs/Theme/config'

export type TSPACINGS = {
  [k in keyof typeof config.spacings]: number
}

export const SPACINGS: TSPACINGS = config.spacings
