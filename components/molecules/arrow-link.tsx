import React, {FC} from 'react';
import {
  AccessibilityProps,
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
  ImageSourcePropType
} from 'react-native';

import {openBrowserAsync} from '../../utils/web-browser';
import {colors} from '../../theme';
import {ScreenNames} from '../../navigation';
const ArrowIcon = require('../../assets/images/icon-arrow/image.png');
const ArrowIconPurple = require('../../assets/images/icon-arrow-purple/image.png');
const ExternalLinkIcon = require('../../assets/images/icon-external-link/image.png');
const ExternalLinkIconLight = require('../../assets/images/icon-external-link-light/image.png');

interface ArrowLinkProps extends AccessibilityProps {
  navigation?: any;
  screen?: ScreenNames;
  externalLink?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  invert?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  icon?: ImageSourcePropType;
}

export const ArrowLink: FC<ArrowLinkProps> = ({
  navigation,
  screen,
  onPress,
  externalLink,
  accessibilityLabel,
  accessibilityHint,
  containerStyle = {},
  textStyle = {},
  invert,
  fullWidth = !!externalLink,
  children,
  icon,
  ...props
}) => {
  const handlePress = () => {
    if (screen && navigation) {
      return navigation.navigate(screen);
    }
    if (externalLink) {
      return openBrowserAsync(externalLink);
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={onPress ? onPress : handlePress}
      accessibilityRole="link"
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      {...props}>
      <View style={[styles.linkContainer, containerStyle]}>
        <View
          style={[!fullWidth && styles.inline, fullWidth && styles.fullWidth]}>
          {children || (
            <Text style={[styles.text, textStyle]}>{accessibilityLabel}</Text>
          )}
        </View>
        <Image
          source={
            icon ||
            (externalLink
              ? invert
                ? ExternalLinkIconLight
                : ExternalLinkIcon
              : invert
              ? ArrowIconPurple
              : ArrowIcon)
          }
          accessibilityIgnoresInvertColors={false}
          style={styles.icon}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inline: {maxWidth: '80%'},
  fullWidth: {flex: 1},
  text: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    color: colors.darkGrey
  },
  icon: {marginLeft: 10}
});
