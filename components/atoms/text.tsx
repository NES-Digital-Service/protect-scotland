import React, {useEffect} from 'react';
import {
  Text as T,
  StyleSheet,
  TextProps as TProps,
  TextStyle
} from 'react-native';

import {useA11yElement} from '../../hooks';
import {text, colors} from '../../theme';

export interface TextProps extends TProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'leader' | 'normal' | 'small';
  inline?: boolean;
  light?: boolean;
  color?: keyof typeof colors;
  align?: TextStyle['textAlign'];
  bold?: boolean;
}

export const Text: React.FC<TextProps> = ({
  variant = 'normal',
  inline,
  accessible,
  light,
  color,
  style,
  children,
  align,
  bold,
  ...props
}) => {
  const {focusRef, focusA11yElement} = useA11yElement();

  useEffect(() => {
    if (accessible) {
      focusA11yElement();
    }
  }, [accessible, focusA11yElement]);

  return (
    <T
      ref={focusRef}
      style={[
        styles.base,
        styles[variant],
        styles.dark,
        inline && styles.inline,
        light && styles.light,
        !!color && {color: colors[color]},
        align && {textAlign: align},
        bold && {
          fontFamily:
            variant === 'leader'
              ? text.fontFamily.latoBold
              : text.fontFamily.robotoBold
        },
        style
      ]}
      accessible={accessible}
      {...props}>
      {children}
    </T>
  );
};

const styles = StyleSheet.create({
  base: {width: '100%'},
  inline: {width: 'auto'},
  h1: {...text.h1Heading},
  h2: {...text.h2Heading},
  h3: {...text.h3Heading},
  h4: {...text.h4Heading},
  leader: {...text.leader},
  normal: {...text.paragraph},
  small: {...text.smallerParagraph},
  dark: {color: colors.darkerPurple},
  light: {color: colors.white}
});

export default Text;
