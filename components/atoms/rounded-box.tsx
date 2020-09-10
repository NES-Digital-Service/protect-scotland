import React, {FC} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {colors} from '../../theme';

interface RoundedBoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const RoundedBox: FC<RoundedBoxProps> = ({children, style}) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    flex: 1,
    paddingVertical: 23,
    paddingHorizontal: 30,
    width: '100%',
    color: colors.darkGrey,
    borderColor: colors.darkGrey
  }
});

export default RoundedBox;
