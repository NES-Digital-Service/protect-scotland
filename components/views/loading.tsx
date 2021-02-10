import React, {FC} from 'react';
import {StyleSheet, Image, View, StatusBar} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Spacing from '../atoms/spacing';
import {colors} from '../../theme';

export const Loading: FC = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {paddingBottom: insets.bottom, paddingTop: insets.top}
      ]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.bg} />
      <Spacing s={50} />
      <Image
        style={styles.center}
        resizeMode="contain"
        source={require('../../assets/images/logo/logo.png')}
        accessible
        accessibilityRole="text"
        accessibilityHint={t('common:name')}
        accessibilityIgnoresInvertColors={false}
      />
      <Spacing s={64} />
      <Spinner animation="fade" visible overlayColor={'transparent'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'flex-start'
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: colors.primaryPurple
  },
  center: {
    alignSelf: 'center'
  }
});
