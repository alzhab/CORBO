import config from 'configs/Theme/config.json'

export type TSPACINGS = {
  [k in keyof typeof config.spacings]: number
}

export const SPACINGS: TSPACINGS = config.spacings
