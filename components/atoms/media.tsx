import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';

import Container from './container';

interface MediaProps {
  left: React.ReactNode;
  leftStyle?: StyleProp<ViewStyle>;
}

const Media: FC<MediaProps> = ({left, leftStyle, children}) => (
  <View style={styles.row}>
    <View style={[styles.left, leftStyle]}>{left}</View>
    <Container>{children}</Container>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  left: {
    marginRight: 25
  }
});

export default Media;
