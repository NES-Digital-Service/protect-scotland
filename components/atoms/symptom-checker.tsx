import React, {FC} from 'react';
import {StyleSheet, View, Image, TouchableWithoutFeedback} from 'react-native';
import {useTranslation} from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';

import RoundedBox from '../atoms/rounded-box';
import {text, colors} from '../../theme';
import Markdown from './markdown';

const SymptomCheckerImage = require('../../assets/images/symptoms/image.png');

export const SymptomCheckerMessage: FC = () => {
  const {t} = useTranslation();
  const handle = () => {
    WebBrowser.openBrowserAsync(t('links:b'), {
      enableBarCollapsing: true,
      showInRecents: true
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handle}>
      <View>
        <RoundedBox style={styles.container}>
          <Image
            width={135}
            height={130}
            source={SymptomCheckerImage}
            accessibilityIgnoresInvertColors={false}
            accessibilityHint={t('symptomChecker:hint')}
          />
          <View style={styles.symptomMessage}>
            <Markdown markdownStyles={markdownStyles}>
              {t('symptomChecker:message')}
            </Markdown>
          </View>
        </RoundedBox>
      </View>
    </TouchableWithoutFeedback>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.smallerParagraph,
    color: colors.darkerPurple
  },
  // @ts-ignore
  strong: {
    ...text.h4Heading,
    color: colors.primaryPurple
  }
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lighterPurple,
    borderColor: colors.lilac,
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 45,
    marginRight: 45,
    width: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 0
  },
  symptomMessage: {
    paddingVertical: 20,
    marginLeft: 15,
    flex: 1
  }
});
