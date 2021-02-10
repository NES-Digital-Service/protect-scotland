import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import Text, {TextProps} from '../atoms/text';

interface TitleProps extends TextProps {
  title: string;
}

export const Title: FC<TitleProps> = ({title, ...props}) => {
  const {t} = useTranslation();
  return (
    <Text
      variant="h1"
      color="primaryPurple"
      maxFontSizeMultiplier={1.75}
      style={styles.title}
      {...props}>
      {t(title)}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 30
  }
});
