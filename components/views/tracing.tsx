import React, {FC, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  ImageStyle,
  ActivityIndicator
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  useExposure,
  StatusState
} from 'react-native-exposure-notification-service';
import {format, isToday, isTomorrow} from 'date-fns';

import {ModalHeader} from '../molecules/modal-header';

import Container from '../atoms/container';
import Text from '../atoms/text';
import Spacing from '../atoms/spacing';
import {text, colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import Markdown from '../atoms/markdown';
import RoundedBox from '../atoms/rounded-box';
import {ScreenNames} from '../../navigation';
import GoToSettings from '../molecules/go-to-settings';
import Button from '../atoms/button';
import {useReminder} from '../../providers/reminder';
import {useSettings} from '../../providers/settings';
import {hasCurrentExposure} from '../../utils/exposure';

const TracingIcon = require('../../assets/images/tracing-active/image.png');
const IconTracingActive = require('../../assets/images/icon-tracing-active-big/image.png');
const IconTracingInactive = require('../../assets/images/icon-tracing-inactive-big/image.png');
const TracingIllustration = require('../../assets/images/tracing-illustration/image.png');
const CloseIcon = require('../../assets/images/icon-close-green/image.png');
const IconPaused = require('../../assets/images/icon-paused/image.png');

export const Tracing: FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const {checked, paused, deleteReminder} = useReminder();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {enabled, status, contacts, start} = useExposure();
  const tracingActive = enabled && status.state === StatusState.active;
  const pauseDate = new Date(Number(paused));
  const {isolationDuration} = useSettings();
  const hasContact = hasCurrentExposure(isolationDuration, contacts);

  if (!checked) {
    return null;
  }

  const renderActive = () => (
    <>
      <Text variant="h3" style={styles.active}>
        {t('tracing:status:heading')}
      </Text>
      <Spacing s={20} />
      <View style={styles.row}>
        <Image
          style={styles.moduleImage as ImageStyle}
          source={IconTracingActive}
          accessibilityIgnoresInvertColors={false}
        />
        <Text variant="h1" style={styles.active}>
          {t('tracing:status:active')}
        </Text>
      </View>
      <Spacing s={20} />
      <Markdown>{t('tracing:message')}</Markdown>
    </>
  );

  const renderInactive = () => (
    <>
      <Text variant="h3" style={styles.notActive}>
        {t('tracing:status:heading')}
      </Text>
      <Spacing s={20} />
      <View style={styles.row}>
        <Image
          style={styles.moduleImage as ImageStyle}
          source={IconTracingInactive}
          accessibilityIgnoresInvertColors={false}
        />
        <Text variant="h1" style={styles.notActive} maxFontSizeMultiplier={3}>
          {t('tracing:status:inactive')}
        </Text>
      </View>
      <Spacing s={20} />
      <Markdown>{t('tracing:inactiveMessage')}</Markdown>
      <Spacing s={20} />
      <Text bold maxFontSizeMultiplier={3}>
        {t('tracing:turnOn1')}
      </Text>
      <Spacing s={20} />
      <Text bold maxFontSizeMultiplier={3}>
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
      <Text variant="h3" style={styles.notActive}>
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
          <Text variant="h1" style={styles.notActive}>
            {t('tracing:paused:title')}
          </Text>
        </View>
      </View>
      <Spacing s={20} />
      <Text bold color="errorRed">
        {t('tracing:paused:reminder')} {format(pauseDate, 'HH:mm')}{' '}
        {isToday(pauseDate)
          ? t('common:today')
          : isTomorrow(pauseDate)
          ? t('common:tomorrow')
          : ''}
      </Text>
      {showSpinner ? (
        <View>
          <Spacing s={36} />
          <ActivityIndicator color={colors.darkGrey} size="large" />
          <Spacing s={36} />
        </View>
      ) : (
        <Markdown markdownStyles={inactiveMarkdownStyles}>
          {t('tracing:paused:text')}
        </Markdown>
      )}
      <Spacing s={20} />
      <Button
        type="primary"
        variant="dark"
        rounded
        onPress={async () => {
          setShowSpinner(true);
          await start();
          deleteReminder();
          setShowSpinner(false);
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
        color="validationGreen"
      />
      <Spacing s={34} />
      <Container center="horizontal">
        {hasContact && (
          <>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate(ScreenNames.closeContact)}>
              <Container center="horizontal">
                <RoundedBox style={styles.notification}>
                  <Text variant="h3" color="errorRed">
                    {t('tracing:notificationTitle')}
                  </Text>
                  <Spacing s={10} />
                  <Markdown markdownStyles={notificationMarkdownStyles}>
                    {t('tracing:notificationBody')}
                  </Markdown>
                </RoundedBox>
              </Container>
            </TouchableWithoutFeedback>
            <Spacing s={55} />
          </>
        )}
        <Image
          source={TracingIllustration}
          accessibilityIgnoresInvertColors={false}
        />
        <Spacing s={43} />
        <Text variant="leader" color="darkGrey" align="center">
          {t('tracing:body')}
        </Text>
        <Spacing s={30} />
        <Markdown accessibleLink={t('links:o')}>
          {t('tracing:additional', {link: t('links:o')})}
        </Markdown>
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
            textColor="validationGreen"
            onPress={() => navigation.navigate(ScreenNames.pause)}
            style={styles.button}
            buttonStyle={styles.buttonStyle}>
            I want to pause Tracing
          </Button>
        )}
      </Container>
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
  },
  block: {
    marginBottom: 8
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  active: {
    color: colors.validationGreen,
    borderColor: colors.validationGreen
  },
  notActive: {
    color: colors.darkGrey,
    borderColor: colors.darkGrey
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
  button: {
    width: '100%'
  },
  buttonStyle: {
    backgroundColor: 'transparent',
    borderColor: colors.validationGreen,
    borderStyle: 'solid',
    borderWidth: 1
  },
  underline: {
    textDecorationColor: colors.errorRed,
    textDecorationLine: 'underline'
  }
});
