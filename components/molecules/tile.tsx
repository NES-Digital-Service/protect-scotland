import React, {FC} from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Image,
  StyleSheet
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import Spacing from '../atoms/spacing';
import Text from '../atoms/text';
import {scale} from '../../theme';
import {useApplication} from '../../providers/context';

interface Tile {
  label: string;
  hint?: string;
  image: any;
  backgroundColor?: string;
  dark?: boolean;
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
  dark,
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
        accessibilityRole="link"
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
          <Spacing s={10} />
          <Text
            color={dark ? 'darkerPurple' : 'white'}
            bold={!additionalLabel && !hint}
            style={styles.tileLabel}>
            {t(label)}
          </Text>
          {additionalLabel && (
            <Text
              color={dark ? 'darkerPurple' : 'white'}
              bold={!hint}
              style={styles.tileLabel}>
              {t(additionalLabel)}
            </Text>
          )}
          {hint && (
            <Text
              color={dark ? 'darkerPurple' : 'white'}
              bold
              style={styles.tileLabel}>
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
      <Spacing s={10} />
      <Text
        color={dark ? 'darkerPurple' : 'white'}
        bold={!additionalLabel && !hint}
        style={styles.tileLabel}>
        {t(label)}
      </Text>
      {hint && (
        <Text
          color={dark ? 'darkerPurple' : 'white'}
          bold
          style={styles.tileLabel}>
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
    lineHeight: scale(22)
  }
});
