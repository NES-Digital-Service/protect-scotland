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
import {format, isToday, isTomorrow} from 'date-fns';

import {ModalHeader} from '../molecules/modal-header';

import Spacing from '../atoms/spacing';
import {text, colors} from '../../theme';
import Markdown from '../atoms/markdown';
import RoundedBox from '../atoms/rounded-box';
import {ScreenNames} from '../../navigation';
import GoToSettings from '../molecules/go-to-settings';
import Button from '../atoms/button';
import {useReminder} from '../../providers/reminder';

const TracingIcon = require('../../assets/images/tracing-active/image.png');
const IconTracingActive = require('../../assets/images/icon-tracing-active-big/image.png');
const IconTracingInactive = require('../../assets/images/icon-tracing-inactive-big/image.png');
const TracingIllustration = require('../../assets/images/tracing-illustration/image.png');
const CloseIcon = require('../../assets/images/icon-close-green/image.png');
const IconPaused = require('../../assets/images/icon-paused/image.png');

export const Tracing: FC = () => {
  const {checked, paused, deleteReminder} = useReminder();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {enabled, status, contacts, start} = useExposure();
  const tracingActive = enabled && status.state === StatusState.active;
  const pauseDate = new Date(Number(paused));

  if (!checked) {
    return <ScrollView style={styles.container} />;
  }

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

  const renderPaused = () => (
    <>
      <Text style={[styles.heading, styles.notActive]}>
        {t('tracing:status:heading')}
      </Text>
      <Spacing s={20} />
      <View style={styles.row}>
        <View>
          <Image
            style={styles.moduleImage as ImageStyle}
            source={IconPaused}
            accessibilityIgnoresInvertColors={false}
          />
        </View>
        <View>
          <Text
            style={[
              styles.text,
              styles.heading,
              styles.status,
              styles.notActive
            ]}>
            {t('tracing:paused:title')}
          </Text>
        </View>
      </View>
      <Spacing s={20} />
      <Text style={styles.reminder}>
        {t('tracing:paused:reminder')} {format(pauseDate, 'HH:mm')}{' '}
        {isToday(pauseDate)
          ? t('common:today')
          : isTomorrow(pauseDate)
          ? t('common:tomorrow')
          : ''}
      </Text>
      <Markdown markdownStyles={inactiveMarkdownStyles}>
        {t('tracing:paused:text')}
      </Markdown>
      <Spacing s={20} />
      <Button
        type="primary"
        variant="dark"
        rounded
        onPress={() => {
          start();
          deleteReminder();
        }}>
        {t('tracing:paused:buttonLabel')}
      </Button>
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
        <RoundedBox
          style={tracingActive && !paused ? styles.active : undefined}>
          {paused
            ? renderPaused()
            : tracingActive
            ? renderActive()
            : renderInactive()}
        </RoundedBox>
        <Spacing s={20} />
        {!paused && tracingActive && (
          <Button
            type="secondary"
            rounded
            textColor={colors.validationGreen}
            onPress={() => navigation.navigate(ScreenNames.pause)}
            style={styles.button}
            buttonStyle={styles.buttonStyle}>
            I want to pause Tracing
          </Button>
        )}
      </View>
      <Spacing s={120} />
    </ScrollView>
  );
};

const inactiveMarkdownStyles = StyleSheet.create({
  text: {
    ...text.default,
    color: colors.darkGrey,
    fontSize: 15,
    lineHeight: 25
  },
  // @ts-ignore
  strong: {
    ...text.defaultBold
  }
});

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
    ...text.h3Heading
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
  text: {
    ...text.smallerParagraph,
    lineHeight: 20
  },
  moduleImage: {
    marginRight: 11,
    width: 40,
    height: 40
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
  },
  button: {
    width: '100%'
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    borderColor: colors.validationGreen,
    borderStyle: 'solid',
    borderWidth: 1
  },
  reminder: {
    ...text.defaultBold,
    color: colors.errorRed
  },
  underline: {
    textDecorationColor: colors.errorRed,
    textDecorationLine: 'underline'
  }
});
