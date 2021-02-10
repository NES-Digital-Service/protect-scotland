// Provides the heights for age and location confirmation images and content
// sized so they best fit the screen ratio without cutting off the graphic.
import {useMemo} from 'react';
import {Dimensions} from 'react-native';

const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');

// The height / width ratio of the illustration and logo
const IMAGE_RATIO = 993 / 1125;
const LOGO_RATIO = 377 / 1125;
// If the ratio of the window dimensions are less then this then don't trim the illustration
const NO_TRIM_RATIO = 0.462;
// If the ratio of the window dimensions are more then this then use the max trim
const MAX_TRIM_RATIO = 0.53;
// The maximum amount to trim from the top of the image
const MAX_TRIM = -30;
// The illustration is displayed full width. From this we can calculate the height
const ILLUSTRATION_HEIGHT = IMAGE_RATIO * WINDOW_WIDTH;
const LOGO_HEIGHT = LOGO_RATIO * WINDOW_WIDTH;

export function useConfirmationSpace(
  minContentHeight: number
): {
  topTrim: number;
  contentHeight: number;
  ILLUSTRATION_HEIGHT: number;
  LOGO_HEIGHT: number;
} {
  const contentHeight = useMemo(() => {
    const bottomHeight = WINDOW_HEIGHT - ILLUSTRATION_HEIGHT - LOGO_HEIGHT;
    return minContentHeight > bottomHeight ? minContentHeight : bottomHeight;
  }, [minContentHeight]);

  const topTrim = useMemo(() => {
    const screenRatio = WINDOW_WIDTH / WINDOW_HEIGHT;
    const trimRange = MAX_TRIM_RATIO - NO_TRIM_RATIO;
    const trimPercent =
      screenRatio < NO_TRIM_RATIO
        ? 0
        : screenRatio > MAX_TRIM_RATIO
        ? 1
        : 1 - (MAX_TRIM_RATIO - screenRatio) / trimRange;
    return trimPercent * MAX_TRIM;
  }, []);

  return {topTrim, contentHeight, ILLUSTRATION_HEIGHT, LOGO_HEIGHT};
}
