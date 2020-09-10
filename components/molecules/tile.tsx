import React, {FC} from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {text, scale, colors} from '../../theme';
import {useApplication} from '../../providers/context';

interface Tile {
  label: string;
  hint?: string;
  image: any;
  backgroundColor?: string;
  invertText?: boolean;
  minHeight?: number;
  dimmed?: boolean;
  link?: string;
  additionalLabel?: string;
  onboardingCallback?: () => void;
}

export const Tile: FC<Tile> = ({
  backgroundColor = 'transparent',
  label,
  hint,
  image,
  invertText,
  minHeight = 135,
  link,
  additionalLabel,
  onboardingCallback
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {onboarded} = useApplication();

  if (link) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (onboarded) {
            navigation.navigate(link);
          } else {
            onboardingCallback && onboardingCallback();
          }
        }}>
        <Animated.View style={[styles.tile, {backgroundColor, minHeight}]}>
          <Image
            source={image}
            accessibilityIgnoresInvertColors={false}
            resizeMethod="resize"
            resizeMode="cover"
          />
          <Text
            style={[
              styles.tileLabel,
              additionalLabel || hint ? styles.tileLabelRegular : {},
              invertText && styles.tileDarkText
            ]}>
            {t(label)}
          </Text>
          {additionalLabel && (
            <Text
              style={[
                // @ts-ignore
                styles.tileLabel,
                styles.tileLabelAdditional,
                invertText ? styles.tileDarkText : {}
              ]}>
              {t(additionalLabel)}
            </Text>
          )}
          {hint && (
            <Text style={[styles.tileLabel, styles.tileLabelAdditional]}>
              {t(hint)}
            </Text>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <Animated.View style={[styles.tile, {backgroundColor, minHeight}]}>
      <Image
        source={image}
        accessibilityIgnoresInvertColors={false}
        resizeMethod="resize"
        resizeMode="contain"
      />
      <Text
        style={[
          styles.tileLabel,
          additionalLabel || hint ? styles.tileLabelRegular : {},
          invertText && styles.tileDarkText
        ]}>
        {t(label)}
      </Text>
      {hint && (
        <Text style={[styles.tileLabel, styles.tileLabelAdditional]}>
          {t(hint)}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    borderRadius: 10,
    justifyContent: 'flex-end',
    padding: 20,
    flex: 1
  },
  tileLabel: {
    ...text.paragraph,
    lineHeight: scale(22),
    fontFamily: text.fontFamily.robotoBold,
    color: colors.white,
    marginTop: 10
  },
  tileLabelRegular: {
    fontFamily: text.fontFamily.roboto
  },
  tileLabelAdditional: {
    marginTop: 0
  },
  tileDarkText: {
    color: colors.darkerPurple
  }
});
