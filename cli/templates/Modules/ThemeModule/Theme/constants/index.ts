import {Dimensions, NativeModules, Platform} from 'react-native';

const {StatusBarManager} = NativeModules;

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;

export const SB_HEIGHT = StatusBarManager ? StatusBarManager.HEIGHT : 0;
export const IS_IOS = Platform.OS === 'ios';
