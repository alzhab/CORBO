import { StatusBarProps } from 'react-native'
import config from 'configs/Theme/config.json'

const colors_types = config.colors
const colors_default_name = Object.keys(config.colors)[0] as ColorsNames
const colors_keys = colors_types[colors_default_name]

export type IColors = {
  [K in keyof typeof colors_keys]: string
}

export type ColorsNames = keyof typeof config.colors

export type ColorsConfig = { [key in ColorsNames]: IColors }

export type SbColorsConfig = { [key in ColorsNames]: StatusBarProps }
