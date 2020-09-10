import React, {FC} from 'react';
import {Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {text, colors} from '../../theme';

interface Title {
  title: string;
}

export const Title: FC<Title> = ({title}) => {
  const {t} = useTranslation();
  return (
    <Text style={styles.title} maxFontSizeMultiplier={1.75}>
      {t(title)}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.h1Heading,
    marginBottom: 30,
    color: colors.primaryPurple
  }
});
