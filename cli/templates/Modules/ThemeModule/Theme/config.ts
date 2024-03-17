import {FONTS_TYPES} from 'configs/Theme/fonts/types';

export interface IStatusBar {
  translucent: boolean;
  backgroundColor: string;
  animated: boolean;
  barStyle: string;
}

const colors = {
  DEFAULT_COLORS: {
    navigation_primary: '#000',
    navigation_background: '#000',
    navigation_card: '#000',
    navigation_text: '#000',
    navigation_border: '#000',
    navigation_notification: '#000',
    screen_background: '#fff',
    default_text: '#000'
  }
};

const fonts = {
  default_text: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: FONTS_TYPES.regular
  }
};

const status_bars: {
  [key in string]: IStatusBar
} = {
  DEFAULT_COLORS: {
    translucent: true,
    backgroundColor: 'transparent',
    animated: true,
    barStyle: 'dark-content'
  }
};

const spacings = {
  container_0: 0
};

export const CONFIG = {
  colors,
  status_bars,
  fonts,
  spacings
};
