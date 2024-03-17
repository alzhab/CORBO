import {StyleProp, ViewStyle} from 'react-native';
import {Spacings} from '@corrbo/module-spacing-props';

export type IIconProps = Spacings & {
  color?: string
  size?: number
  sizeType?: 'width' | 'height'
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  pressableStyle?: StyleProp<ViewStyle>
}
