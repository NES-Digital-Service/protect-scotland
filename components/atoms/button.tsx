import React, {useMemo, useState} from 'react';
import {
  StyleSheet,
  ViewStyle,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import {colors} from '../../theme';

export type ButtonTypes = 'primary' | 'secondary' | 'link' | 'back';
export type ButtonVariants = 'inverted' | 'dark';

interface ButtonColors {
  shadow: string;
  background: string;
  text: string;
  pressedText?: string;
  border?: string;
}

interface ButtonProps {
  type?: ButtonTypes;
  variant?: ButtonVariants;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  width?: number | string;
  children: React.ReactNode;
  label?: string;
  hint?: string;
  textColor?: string;
  icon?: any;
  buttonStyle?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  variant,
  disabled = false,
  onPress,
  style,
  width,
  children,
  hint,
  label,
  textColor,
  icon,
  buttonStyle
}) => {
  const [pressed, setPressed] = useState(false);

  const selectedColors: ButtonColors = useMemo(() => {
    switch (type) {
      case 'primary':
        return {
          ...buttonColors.primary,
          ...(variant === 'inverted' && buttonColors.primaryInverted),
          ...(variant === 'dark' && buttonColors.primaryDark)
        };
      case 'secondary':
        return {
          ...buttonColors.secondary,
          ...(variant === 'dark' && buttonColors.secondaryDark)
        };
      case 'back':
        return buttonColors.back;
      case 'link':
        return buttonColors.link;
    }
  }, [type, variant]);

  let backgroundColor = selectedColors.shadow;
  let foregroundColor = selectedColors.background;
  let borderColor = selectedColors.border;
  textColor = textColor || selectedColors.text;

  if (pressed) {
    foregroundColor = backgroundColor;
    if (selectedColors.pressedText) {
      textColor = selectedColors.pressedText;
    }
  } else if (disabled) {
    // this should be enough for the moment
    backgroundColor += '66';
    foregroundColor += '66';
    if (borderColor) {
      borderColor += '66';
    }
  }

  const pressHandlers = disabled
    ? {}
    : {
        onPressIn: () => setPressed(true),
        onPressOut: () => setPressed(false),
        onPress
      };

  return (
    <View
      style={[
        styles.wrapper,
        type !== 'secondary' && {backgroundColor},
        type === 'link' && styles.wrapperLink,
        type === 'back' && styles.wrapperBack,
        !!width && {width},
        style
      ]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              type === 'secondary' && disabled
                ? buttonColors.secondary.background
                : foregroundColor
          },
          !!borderColor && {
            borderColor: borderColor,
            borderWidth: 2
          },
          type === 'link' && styles.buttonLink,
          type === 'back' && styles.buttonBack,
          buttonStyle
        ]}
        accessibilityRole="button"
        importantForAccessibility="yes"
        activeOpacity={1}
        accessibilityHint={hint}
        accessibilityLabel={label}
        {...pressHandlers}>
        {type === 'back' ? (
          <View>{children}</View>
        ) : (
          <View style={styles.row}>
            {icon && (
              <Image
                source={icon}
                style={styles.icon}
                accessibilityIgnoresInvertColors={false}
              />
            )}
            <Text style={[styles.text, {color: textColor}]}>{children}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const buttonColors = {
  primary: {
    shadow: colors.darkPurple,
    text: colors.white,
    background: colors.primaryPurple
  },
  primaryInverted: {
    shadow: colors.white,
    text: colors.primaryPurple,
    background: colors.white
  },
  primaryDark: {
    shadow: colors.blueGrey,
    text: colors.white,
    background: colors.darkGrey
  },
  secondary: {
    shadow: colors.primaryPurple,
    text: colors.primaryPurple,
    background: colors.transparent,
    pressedText: colors.white,
    border: colors.primaryPurple
  },
  secondaryDark: {
    shadow: colors.darkGrey,
    text: colors.darkGrey,
    background: colors.transparent,
    pressedText: colors.white,
    border: colors.darkGrey
  },
  back: {
    shadow: colors.white,
    background: colors.white,
    text: colors.darkGrey
  },
  link: {
    shadow: colors.darkGrey,
    background: 'transparent',
    text: colors.darkGrey
  }
};

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 75,
    justifyContent: 'flex-start',
    borderRadius: 3
  },
  wrapperLink: {
    minHeight: 20,
    backgroundColor: 'transparent'
  },
  wrapperBack: {
    minHeight: 30,
    minWidth: 30,
    borderRadius: 15
  },
  button: {
    minHeight: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    paddingHorizontal: 12
  },
  buttonLink: {
    minHeight: 20,
    backgroundColor: 'transparent'
  },
  buttonBack: {
    minWidth: 30,
    minHeight: 30,
    borderRadius: 15
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 20
  },
  row: {
    flexDirection: 'row'
  },
  icon: {
    marginRight: 10
  }
});

export default Button;
