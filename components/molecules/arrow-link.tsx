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
  Platform
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import {colors} from '../../theme';
import {ScreenNames} from '../../navigation';
const ArrowIcon = require('../../assets/images/icon-arrow/image.png');
const ArrowIconPurple = require('../../assets/images/icon-arrow-purple/image.png');
const ExternalLinkIcon = require('../../assets/images/icon-external-link/image.png');

interface ArrowLinkProps extends AccessibilityProps {
  navigation?: any;
  screen?: ScreenNames;
  externalLink?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  invert?: boolean;
  onPress?: () => void;
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
  invert = false
}) => {
  const handlePress = () => {
    if (screen && navigation) {
      return navigation.navigate(screen);
    }
    if (externalLink) {
      WebBrowser.openBrowserAsync(externalLink, {
        enableBarCollapsing: true,
        showInRecents: true
      });
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={onPress ? onPress : handlePress}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}>
      <View style={[styles.linkContainer, containerStyle]}>
        <Text style={[styles.button, textStyle]}>{accessibilityLabel}</Text>
        <Image
          source={
            externalLink
              ? ExternalLinkIcon
              : invert
              ? ArrowIconPurple
              : ArrowIcon
          }
          accessibilityIgnoresInvertColors={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    color: colors.darkGrey,
    marginRight: 10,
    fontWeight: 'bold',
    ...Platform.select({
      android: {
        maxWidth: '80%'
      }
    })
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
