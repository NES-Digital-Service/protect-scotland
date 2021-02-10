import React, {FC} from 'react';
import {StyleSheet, View, Image, TouchableWithoutFeedback} from 'react-native';
import {useTranslation} from 'react-i18next';

import Text, {TextProps} from '../atoms/text';
import Container from '../atoms/container';
import {ModalClose} from '../atoms/modal-close';
import Spacing from '../atoms/spacing';

import {colors} from '../../theme';
import {Back, BackProps} from '../atoms/back';

interface ModalHeader {
  icon?: any;
  closeIcon?: React.ReactNode;
  heading?: string;
  color?: TextProps['color'];
  back?: boolean;
  backVariant?: BackProps['variant'];
  type?: 'default' | 'inline';
  left?: boolean;
  action?: () => void;
  onClosePress?: () => void;
}

export const ModalHeader: FC<ModalHeader> = ({
  type = 'default',
  icon,
  closeIcon,
  heading,
  color,
  back = false,
  backVariant,
  left = false,
  action,
  onClosePress
}) => {
  const {t} = useTranslation();

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
            {back && (
              <View style={styles.back}>
                <Back variant={backVariant} />
              </View>
            )}
            <ModalClose icon={closeIcon} onPress={onClosePress} />
          </>
        ) : (
          <Container style={styles.inline}>
            <Container style={styles.row} center="horizontal">
              <View style={styles.dot} />
              <Text
                variant="h3"
                color="darkGrey"
                maxFontSizeMultiplier={3}
                accessible>
                {heading}
              </Text>
            </Container>
            <ModalClose />
          </Container>
        )}
      </View>
      {(icon || heading) && type === 'default' && (
        <Container center="both" style={styles.row}>
          <Spacing s={20} />
          <Container
            center="both"
            style={[styles.row, icon && styles.column, left && styles.left]}>
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
                  variant="h1"
                  align="center"
                  maxFontSizeMultiplier={3}
                  accessible
                  color={color}
                  style={[
                    styles.heading,
                    !back && !icon && styles.marginTop,
                    left && styles.left
                  ]}>
                  {t(heading)}
                </Text>
              </TouchableWithoutFeedback>
            )}
            {!action && heading && (
              <Text
                variant="h1"
                align="center"
                accessible
                maxFontSizeMultiplier={3}
                color={color}
                style={[
                  styles.heading,
                  !back && !icon && styles.marginTop,
                  left && styles.left
                ]}>
                {t(heading)}
              </Text>
            )}
          </Container>
        </Container>
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
  back: {
    marginBottom: 44
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
    textAlignVertical: 'center',
    flex: 1,
    flexWrap: 'wrap'
  },
  inline: {
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
  left: {
    textAlign: 'left',
    justifyContent: 'flex-start'
  },
  marginTop: {
    marginTop: 44
  }
});
