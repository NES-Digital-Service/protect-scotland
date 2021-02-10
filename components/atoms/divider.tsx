import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../../theme';

interface DividerProps {
  color?: 'lilac' | 'white';
}

export const Divider: FC<DividerProps> = ({color = 'lilac'}) => (
  <View style={styles.divider}>
    <View style={[styles.fill, {backgroundColor: colors[color]}]} />
  </View>
);

const styles = StyleSheet.create({
  divider: {
    height: 2,
    width: '100%'
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    left: -10,
    right: -10
  }
});

export default Divider;
