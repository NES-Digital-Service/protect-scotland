import React from 'react';
import {StyleSheet, Text, View, ViewStyle, ScrollView} from 'react-native';
import ReactNativeModal, {
  ModalProps as ReactNativeModalProps
} from 'react-native-modal';
import {useSafeArea} from 'react-native-safe-area-context';

import Button, {ButtonTypes, ButtonVariants} from '../../atoms/button';
import {text, colors} from '../../../theme';
import {useApplication} from '../../../providers/context';
import {
  SPACING_BOTTOM,
  SPACING_HORIZONTAL
} from '../../../theme/layouts/shared';
import Spacing from '../../atoms/spacing';
import {ModalClose} from '../../atoms/modal-close';

type ModalButton = {
  label: string;
  action: () => void;
  hint: string;
  type?: ButtonTypes;
  variant?: ButtonVariants;
  buttonStyle?: ViewStyle;
};

type ModalType = 'dark' | 'light';

export interface ModalProps extends Partial<ReactNativeModalProps> {
  title?: string;
  buttons?: Array<ModalButton>;
  isVisible?: boolean;
  closeButton?: boolean;
  type?: ModalType;
  onClose(): void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  buttons,
  style,
  type = 'light',
  isVisible = true,
  closeButton = true,
  ...rest
}) => {
  const insets = useSafeArea();
  const {accessibility} = useApplication();
  const isDark = type === 'dark';

  return (
    <View style={styles.wrapper}>
      <ReactNativeModal
        {...rest}
        animationIn={accessibility.reduceMotionEnabled ? 'fadeIn' : 'slideInUp'}
        animationOut={
          accessibility.reduceMotionEnabled ? 'fadeOut' : 'slideOutDown'
        }
        isVisible={isVisible}
        style={styles.bottomModal}>
        <View
          style={[
            styles.contentContainer,
            isDark && styles.contentContainerDark,
            closeButton && styles.contentWithCloseButton,
            {paddingBottom: insets.bottom},
            style
          ]}>
          {closeButton && (
            <View style={styles.closeHeader}>
              <ModalClose onPress={onClose} notification />
            </View>
          )}
          <ScrollView>
            {title && (
              <Text style={[styles.title, isDark && styles.titleDark]}>
                {title}
              </Text>
            )}
            <Spacing s={24} />
            {children}
            <Spacing s={24} />
            {!!buttons &&
              buttons.map(
                (
                  {label, hint, action, type: buttonType, variant, buttonStyle},
                  index
                ) => (
                  <>
                    <Button
                      type={buttonType}
                      variant={variant}
                      label={label}
                      key={index}
                      onPress={() => {
                        action();
                        onClose();
                      }}
                      hint={hint}
                      buttonStyle={buttonStyle}>
                      {label}
                    </Button>
                    {index + 1 < buttons.length && <Spacing s={16} />}
                  </>
                )
              )}
            <Spacing s={30} />
          </ScrollView>
        </View>
      </ReactNativeModal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {height: 0},
  closeHeader: {
    position: 'absolute',
    top: 30,
    right: SPACING_HORIZONTAL
  },
  title: {
    ...text.leader,
    color: colors.darkGrey
  },
  titleDark: {
    ...text.leader,
    color: colors.white
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  contentContainer: {
    paddingHorizontal: SPACING_HORIZONTAL,
    paddingBottom: SPACING_BOTTOM,
    backgroundColor: colors.white,
    maxHeight: '60%'
  },
  contentContainerDark: {
    backgroundColor: colors.darkPurple
  },
  contentWithCloseButton: {
    paddingTop: 70
  }
});

export default Modal;
