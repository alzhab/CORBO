import { verticalScale } from 'react-native-size-matters/extend'
import { FONTS_TYPES } from "configs/Theme/fonts/types";
import { CONFIG as config } from 'configs/Theme/config'

export type TTYPOGRAPHY = {
  [K in keyof typeof config.fonts]: TTYPOGRAPHT_ITEM
}

type TTYPOGRAPHT_ITEM = {
  fontSize: number
  fontFamily: string
  lineHeight: number
}

export const TYPOGRAPHY: TTYPOGRAPHY = Object.keys(config.fonts).reduce(
  (accumulator, key) => {
    const item: TTYPOGRAPHT_ITEM =
      config.fonts[key as keyof typeof config.fonts]

    return {
      ...accumulator,
      [key]: {
        fontSize: verticalScale(+item.fontSize),
        lineHeight: verticalScale(+item.lineHeight),
        fontFamily: FONTS_TYPES[item.fontFamily as keyof typeof FONTS_TYPES],
      },
    }
  },
  {} as TTYPOGRAPHY,
)
