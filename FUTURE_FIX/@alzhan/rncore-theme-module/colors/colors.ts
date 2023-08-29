import { ColorsConfig, ColorsNames, SbColorsConfig } from './types'
import config from 'configs/Theme/config.json'

export const COLORS: ColorsConfig = config.colors as ColorsConfig

export const DEFAULT_COLORS_NAME: ColorsNames = Object.keys(
  config.colors,
)[0] as ColorsNames
export const COLORS_SB_PROPS: SbColorsConfig = config.status_bars as SbColorsConfig
