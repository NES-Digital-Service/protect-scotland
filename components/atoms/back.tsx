import React, {FC} from 'react';
import {View, Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {colors} from '../../theme';

const IconBack = require('../../assets/images/icon-back-light/image.png');
const IconBackDark = require('../../assets/images/icon-back/image.png');
const IconBackArrowDark = require('../../assets/images/back/image.png');

export interface BackProps {
  variant?: 'default' | 'light' | 'dark';
  onPress?: () => void;
}

const icons = {
  default: IconBackArrowDark,
  light: IconBack,
  dark: IconBackDark
};

export const Back: FC<BackProps> = ({
  variant = 'default',
  onPress: onPressProp
}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const onPress = () => navigation.goBack();

  return (
    <TouchableWithoutFeedback
      accessible
      accessibilityRole="button"
      accessibilityHint={t('common:back:hint')}
      accessibilityLabel={t('common:back:label')}
      onPress={onPressProp || onPress}>
      <View style={styles.container}>
        <Image
          source={icons[variant]}
          accessibilityIgnoresInvertColors={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
