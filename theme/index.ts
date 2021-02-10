import {Dimensions, Platform} from 'react-native';
import colors from './colors';

import getTextStyles from './text';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PADDING_TOP = Platform.OS === 'ios' ? 65 : 30;
const REF_HEIGHT = 667;

const text = getTextStyles(scale);

function scale(value: number): number {
  const ratio = value / REF_HEIGHT;
  return Math.min(Math.round(ratio * SCREEN_HEIGHT), value);
}

export {scale, text, colors, PADDING_TOP};
