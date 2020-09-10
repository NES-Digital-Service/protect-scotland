import React, {FC, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  findNodeHandle,
  AccessibilityInfo
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

import {ModalClose} from '../atoms/modal-close';
import Spacing from '../atoms/spacing';

import {text, colors} from '../../theme';
import {Back} from '../atoms/back';
import {useApplication} from '../../providers/context';

interface ModalHeader {
  icon?: any;
  closeIcon?: React.ReactNode;
  backIcon?: React.ReactNode;
  heading?: string;
  color?: string;
  back?: boolean;
  type?: 'default' | 'inline';
  left?: boolean;
  action?: () => void;
}

export const ModalHeader: FC<ModalHeader> = ({
  type = 'default',
  icon,
  closeIcon,
  backIcon,
  heading,
  color,
  back = false,
  left = false,
  action
}) => {
  const {t} = useTranslation();
  const focusStart = useRef<any>();
  const isFocused = useIsFocused();
  const {
    accessibility: {screenReaderEnabled}
  } = useApplication();

  useEffect(() => {
    if (screenReaderEnabled && focusStart.current) {
      const tag = findNodeHandle(focusStart.current);
      if (tag) {
        setTimeout(() => AccessibilityInfo.setAccessibilityFocus(tag), 250);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(() => {
    if (screenReaderEnabled && isFocused && focusStart.current) {
      const tag = findNodeHandle(focusStart.current);
      if (tag) {
        setTimeout(() => AccessibilityInfo.setAccessibilityFocus(tag), 200);
      }
    }
  });

  return (
    <View
      style={[styles.container, type === 'inline' && styles.containerInline]}>
      <View
        style={[
          styles.row,
          back || type === 'inline' ? styles.spaceBetween : styles.end
        ]}>
        {type === 'default' ? (
          <>
            {back && <Back icon={backIcon} />}
            <ModalClose icon={closeIcon} />
          </>
        ) : (
          <View style={styles.inline}>
            <View style={[styles.row, styles.header]}>
              <View style={styles.dot} />
              <Text
                maxFontSizeMultiplier={3}
                ref={focusStart}
                style={styles.title}>
                {heading}
              </Text>
            </View>
            <ModalClose />
          </View>
        )}
      </View>
      {(icon || heading) && type === 'default' && (
        <View style={styles.content}>
          <Spacing s={20} />
          <View
            style={[
              styles.content,
              icon ? styles.column : styles.row,
              left ? styles.left : {}
            ]}>
            {icon && (
              <Image
                style={styles.icon}
                resizeMode="contain"
                resizeMethod="resize"
                source={icon}
                accessibilityIgnoresInvertColors={false}
              />
            )}
            {icon && heading && <Spacing s={16} />}
            {action && heading && (
              <TouchableWithoutFeedback onPress={action}>
                <Text
                  ref={focusStart}
                  maxFontSizeMultiplier={3}
                  style={[
                    styles.heading,
                    color ? {color} : {},
                    !back && !icon ? styles.marginTop : {},
                    left ? styles.left : {}
                  ]}>
                  {t(heading)}
                </Text>
              </TouchableWithoutFeedback>
            )}
            {!action && heading && (
              <Text
                ref={focusStart}
                maxFontSizeMultiplier={3}
                style={[
                  styles.heading,
                  color ? {color} : {},
                  !back && !icon ? styles.marginTop : {},
                  left ? styles.left : {}
                ]}>
                {t(heading)}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 120
  },
  containerInline: {
    paddingBottom: 30,
    minHeight: 'auto'
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  content: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  end: {
    justifyContent: 'flex-end'
  },
  spaceBetween: {
    justifyContent: 'space-between'
  },
  icon: {
    alignSelf: 'center',
    width: 25
  },
  heading: {
    ...text.h1Heading,
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    flexWrap: 'wrap'
  },
  header: {
    alignItems: 'center'
  },
  inline: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dot: {
    backgroundColor: colors.errorRed,
    borderRadius: 15,
    width: 15,
    height: 15,
    marginRight: 15
  },
  title: {
    ...text.h3Heading,
    color: colors.darkGrey
  },
  left: {
    textAlign: 'left',
    justifyContent: 'flex-start'
  },
  marginTop: {
    marginTop: 44
  }
});
