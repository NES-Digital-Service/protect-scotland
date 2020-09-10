import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../theme';

const Base: React.FC = ({children}) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
});

export {Base};
