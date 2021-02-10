import React, {FC} from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';

interface ContainerProps extends ViewProps {
  center?: 'horizontal' | 'vertical' | 'both';
  stretch?: boolean;
}

const Container: FC<ContainerProps> = ({
  center,
  stretch = true,
  children,
  style,
  ...props
}) => (
  <View
    style={[
      styles.base,
      stretch && styles.stretch,
      ...(center === 'both'
        ? [styles.centerHorizontal, styles.centerVertical]
        : [
            center === 'horizontal' && styles.centerHorizontal,
            center === 'vertical' && styles.centerVertical
          ]),
      style
    ]}
    {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  base: {width: '100%'},
  stretch: {flex: 1},
  centerHorizontal: {alignItems: 'center'},
  centerVertical: {justifyContent: 'center'}
});

export default Container;
