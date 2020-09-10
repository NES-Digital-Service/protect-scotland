import React, {FC} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  ImageStyle
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  useExposure,
  StatusState
} from 'react-native-exposure-notification-service';

import {ModalHeader} from '../molecules/modal-header';

import Spacing from '../atoms/spacing';
import {text, colors} from '../../theme';
import Markdown from '../atoms/markdown';
import RoundedBox from '../atoms/rounded-box';
import {ScreenNames} from '../../navigation';
import GoToSettings from '../molecules/go-to-settings';

const TracingIcon = require('../../assets/images/tracing-active/image.png');
const IconTracingActive = require('../../assets/images/icon-tracing-active-big/image.png');
const IconTracingInactive = require('../../assets/images/icon-tracing-inactive-big/image.png');
const TracingIllustration = require('../../assets/images/tracing-illustration/image.png');
const CloseIcon = require('../../assets/images/icon-close-green/image.png');

export const Tracing: FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {enabled, status, contacts} = useExposure();
  const tracingActive = enabled && status.state === StatusState.active;

  const renderActive = () => (
    <>
      <Text style={[styles.heading, styles.active]}>
        {t('tracing:status:heading')}
      </Text>
      <Spacing s={20} />
      <View style={styles.row}>
        <Image
          style={styles.moduleImage as ImageStyle}
          source={IconTracingActive}
          accessibilityIgnoresInvertColors={false}
        />
        <Text style={[styles.status, styles.active]}>
          {t('tracing:status:active')}
        </Text>
      </View>
      <Spacing s={20} />
      <Markdown>{t('tracing:message')}</Markdown>
    </>
  );

  const renderInactive = () => (
    <>
      <Text style={[styles.heading, styles.notActive]}>
        {t('tracing:status:heading')}
      </Text>
      <Spacing s={20} />
      <View style={styles.row}>
        <Image
          style={styles.moduleImage as ImageStyle}
          source={IconTracingInactive}
          accessibilityIgnoresInvertColors={false}
        />
        <Text
          style={[styles.status, styles.notActive]}
          maxFontSizeMultiplier={3}>
          {t('tracing:status:inactive')}
        </Text>
      </View>
      <Spacing s={20} />
      <Markdown>{t('tracing:inactiveMessage')}</Markdown>
      <Spacing s={20} />
      <Text style={styles.bold} maxFontSizeMultiplier={3}>
        {t('tracing:turnOn1')}
      </Text>
      <Spacing s={20} />
      <Text style={styles.bold} maxFontSizeMultiplier={3}>
        {t('tracing:turnOn2')}
      </Text>
      <Spacing s={30} />
      <GoToSettings />
      <Spacing s={40} />
      <Markdown>{t('tracing:inactiveMessage1')}</Markdown>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <ModalHeader
        icon={TracingIcon}
        closeIcon={CloseIcon}
        heading="tracing:heading"
        color={colors.validationGreen}
      />
      <Spacing s={34} />
      <View style={styles.content}>
        {contacts && contacts.length > 0 && (
          <>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate(ScreenNames.closeContact)}>
              <View style={styles.content}>
                <RoundedBox style={styles.notification}>
                  <Text style={styles.notificationHeading}>
                    {t('tracing:notificationTitle')}
                  </Text>
                  <Spacing s={10} />
                  <Markdown markdownStyles={notificationMarkdownStyles}>
                    {t('tracing:notificationBody')}
                  </Markdown>
                </RoundedBox>
              </View>
            </TouchableWithoutFeedback>
            <Spacing s={55} />
          </>
        )}
        <Image
          source={TracingIllustration}
          accessible
          accessibilityHint={t('tracing:illustrationLabel')}
          accessibilityIgnoresInvertColors={false}
        />
        <Spacing s={43} />
        <Text style={styles.body}>{t('tracing:body')}</Text>
        <Spacing s={30} />
        <Markdown>{t('tracing:additional', {link: t('links:o')})}</Markdown>
        <Spacing s={34} />
        <RoundedBox style={tracingActive ? styles.active : undefined}>
          {tracingActive ? renderActive() : renderInactive()}
        </RoundedBox>
        <Spacing s={20} />
      </View>
      <Spacing s={80} />
    </ScrollView>
  );
};

const notificationMarkdownStyles = StyleSheet.create({
  text: {
    ...text.leader,
    color: colors.darkGrey
  },
  // @ts-ignore
  strong: {
    fontFamily: text.fontFamily.latoBold
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingLeft: 45,
    paddingRight: 45
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  body: {
    ...text.leader,
    color: colors.darkGrey,
    textAlign: 'center'
  },
  heading: {
    ...text.h4Heading
  },
  active: {
    color: colors.validationGreen,
    borderColor: colors.validationGreen
  },
  notActive: {
    color: colors.darkGrey,
    borderColor: colors.darkGrey
  },
  // @ts-ignore
  status: {
    ...text.h1Heading
  },
  moduleImage: {
    marginRight: 11
  },
  notification: {
    borderColor: colors.errorRed,
    backgroundColor: colors.white
  },
  // @ts-ignore
  notificationHeading: {
    ...text.h3Heading,
    color: colors.errorRed
  },
  bold: {
    ...text.defaultBold
  }
});
