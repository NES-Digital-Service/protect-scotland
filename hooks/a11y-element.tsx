import React, {useRef, useCallback, useMemo} from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  StyleSheet,
  View,
  ViewProps,
  Platform
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {useApplication} from '../providers/context';

export const A11yView = React.forwardRef<View, ViewProps>((props, ref) => (
  <View
    ref={ref}
    accessible={Platform.OS === 'android'}
    style={StyleSheet.absoluteFill}
    {...props}
  />
));

export function useA11yElement() {
  const {
    accessibility: {screenReaderEnabled}
  } = useApplication();
  const focusRef = useRef(null);
  const isFocused = useIsFocused();

  const focusA11yElement = useCallback(
    (timeout = 250) => {
      if (screenReaderEnabled && focusRef.current && isFocused) {
        const tag = findNodeHandle(focusRef.current);
        if (tag) {
          const id = setTimeout(
            () => AccessibilityInfo.setAccessibilityFocus(tag),
            timeout
          );
          return () => clearTimeout(id);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenReaderEnabled, focusRef.current, isFocused]
  );

  const a11yProps = useMemo(
    () => ({
      ref: focusRef
    }),
    []
  );

  return {a11yProps, focusRef, focusA11yElement};
}
