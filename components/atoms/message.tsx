import React, {FC} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  ImageSourcePropType
} from 'react-native';
import {withTranslation, WithTranslation} from 'react-i18next';

import RoundedBox from './rounded-box';
import Container from './container';
import {text, colors} from '../../theme';
import Markdown from './markdown';
import {openBrowserAsync} from '../../utils/web-browser';

const SymptomCheckerImage = require('../../assets/images/symptoms/image.png');

interface MessageProps extends TouchableWithoutFeedbackProps, WithTranslation {
  image?: ImageSourcePropType;
  markdown?: string;
  link?: string;
}

const MessageBase: FC<MessageProps> = ({
  t,
  image = SymptomCheckerImage,
  markdown = t('symptomChecker:message'),
  link = t('links:b'),
  accessibilityLabel = t('symptomChecker:a11y:label'),
  accessibilityHint = t('symptomChecker:a11y:hint'),
  ...props
}) => (
  <TouchableWithoutFeedback
    onPress={() => openBrowserAsync(link!)}
    accessibilityRole="link"
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    {...props}>
    <View>
      <RoundedBox style={styles.container}>
        <Image
          width={135}
          height={130}
          source={image}
          accessibilityIgnoresInvertColors={false}
        />
        <Container style={styles.symptomMessage}>
          <Markdown markdownStyles={markdownStyles}>{markdown}</Markdown>
        </Container>
      </RoundedBox>
    </View>
  </TouchableWithoutFeedback>
);

const markdownStyles = StyleSheet.create({
  text: {
    ...text.smallerParagraph,
    color: colors.darkerPurple
  },
  // @ts-ignore
  strong: {
    ...text.h4Heading,
    color: colors.primaryPurple
  },
  block: {
    margin: 0
  }
});

const styles = StyleSheet.create({
  container: {
    borderColor: colors.lighterPurple,
    backgroundColor: colors.lighterPurple,
    alignItems: 'center',
    flexDirection: 'row',
    width: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 0
  },
  symptomMessage: {
    paddingVertical: 20,
    marginLeft: 15
  }
});

export const Message = withTranslation()(MessageBase);
