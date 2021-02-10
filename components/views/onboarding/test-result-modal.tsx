import React from 'react';
import {View, ScrollView, StyleSheet, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSafeArea} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import Markdown from '../../atoms/markdown';
import Spacing from '../../atoms/spacing';
import {colors, text} from '../../../theme';
import {ModalClose} from '../../atoms/modal-close';
import Illustration from '../../atoms/illustration';
import {ArrowLink} from '../../molecules/arrow-link';
import Text from '../../atoms/text';

const ModalIllustrationSource = require('../../../assets/images/test-result-modal-illustration/image.png');
const AndroidMessageSource = require('../../../assets/images/message/android/image.png');
const IosMessageSource = require('../../../assets/images/message/ios/image.png');

export const TestResultModal: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeArea();
  return (
    <View
      style={[
        styles.modal,
        {marginTop: insets.top + (Platform.OS === 'android' ? 25 : 5)}
      ]}>
      <View style={styles.header}>
        <ModalClose onPress={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text
          variant="h2"
          color="darkerPurple"
          accessible
          style={styles.narrow}
          align="center">
          {t('onboarding:testResult:accessibility:howToAddResultLabel')}
        </Text>
        <Spacing s={20} />
        <Illustration source={ModalIllustrationSource} />
        <Spacing s={20} />
        <Markdown markdownStyles={modalMarkdownStyles} style={styles.narrow}>
          {t('onboarding:testResult:modal:content')}
        </Markdown>
        <Illustration
          fullWidth
          source={
            Platform.OS === 'ios' ? IosMessageSource : AndroidMessageSource
          }
          accessible
          accessibilityHint={t(
            'onboarding:testResult:accessibility:messageIllustrationAlt'
          )}
        />
        <Spacing s={32} />
        <Markdown markdownStyles={modalMarkdownStyles} style={styles.narrow}>
          {t('onboarding:testResult:modal:content1')}
        </Markdown>
        <ArrowLink
          containerStyle={styles.narrow}
          externalLink={t('links:a')}
          fullWidth
          accessibilityHint={t('onboarding:testResult:modal:linkHint')}>
          <Text variant="h4" color="primaryPurple">
            {t('onboarding:testResult:modal:link')}
          </Text>
        </ArrowLink>
        <Spacing s={50} />
      </ScrollView>
    </View>
  );
};

const modalMarkdownStyles = StyleSheet.create({
  text: {
    ...text.paragraph,
    color: colors.darkerPurple
  },
  strong: {
    fontFamily: text.fontFamily.latoBold
  }
});

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.errorRedTint,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    flex: 1
  },
  contentContainerStyle: {
    flexGrow: 1
  },
  alertImg: {
    width: '100%'
  },
  narrow: {paddingHorizontal: 35},
  header: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
