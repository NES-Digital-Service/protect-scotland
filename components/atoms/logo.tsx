import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

const LogoImage = require('../../assets/images/logo/logo.png');

const Logo: FC = () => {
  const insets = useSafeArea();

  return (
    <View style={[styles.container, {paddingTop: insets.top + 50}]}>
      <Image
        source={LogoImage}
        style={styles.logo}
        accessibilityIgnoresInvertColors={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1
  },
  logo: {
    width: 101,
    height: 29,
    marginBottom: 12
  }
});

export default Logo;
