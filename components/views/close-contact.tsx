import React, {FC} from 'react';
import {ScrollView, Text, StyleSheet, Platform, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import {useExposure} from 'react-native-exposure-notification-service';
import sub from 'date-fns/sub';
import format from 'date-fns/format';
import maxBy from 'lodash/maxBy';

import {ModalHeader} from '../molecules/modal-header';
import Spacing from '../atoms/spacing';
import Button from '../atoms/button';
import Markdown from '../atoms/markdown';
import RoundedBox from '../atoms/rounded-box';
import {text, colors} from '../../theme';
import {ArrowLink} from '../molecules/arrow-link';
import {useSettings} from '../../providers/settings';
import PushNotification from 'react-native-push-notification';

const TelIcon = require('../../assets/images/icon-tel/image.png');

interface CloseContactProps {}

export const CloseContact: FC<CloseContactProps> = () => {
  const {t} = useTranslation();
  const {contacts} = useExposure();
  const handleExternal = (link: string) => {
    WebBrowser.openBrowserAsync(link, {
      enableBarCollapsing: true,
      showInRecents: true
    });
  };
  const {
    isolationDuration,
    isolationEnd,
    testingInstructions,
    helplineString,
    helplineNumber,
    closeContactAssistance
  } = useSettings();
  PushNotification.setApplicationIconBadgeNumber(0);

  const latestExposure = maxBy(contacts, (contact) =>
    Number(contact.exposureAlertDate)
  );

  return (
    <ScrollView style={styles.container}>
      <ModalHeader type="inline" heading={t('closeContact:title')} />
      <Text style={styles.warning}>{t('closeContact:warning')}</Text>
      <Spacing s={32} />
      <Markdown markdownStyles={leaderMarkdownStyles}>
        {t('closeContact:body1', {
          isolationDuration,
          isolationEnd,
          exposureDate: latestExposure
            ? format(
                sub(Number(latestExposure.exposureAlertDate), {
                  days: latestExposure.daysSinceLastExposure
                }),
                'd MMM yyyy'
              )
            : undefined
        })}
      </Markdown>
      <Spacing s={24} />
      <Markdown markdownStyles={textMarkdownStyles}>
        {t('closeContact:body2', {testingInstructions, link: t('links:p')})}
      </Markdown>
      <Spacing s={24} />
      <ArrowLink
        externalLink={t('links:c')}
        accessibilityHint={t('closeContact:link1Hint')}
        accessibilityLabel={t('closeContact:link1')}
        onPress={() => handleExternal(t('links:c'))}
        textStyle={styles.arrowLinkText}
      />
      <Spacing s={24} />
      <ArrowLink
        externalLink={t('links:d')}
        accessibilityHint={t('closeContact:link2Hint')}
        accessibilityLabel={t('closeContact:link2')}
        onPress={() => handleExternal(t('links:d'))}
        textStyle={styles.arrowLinkText}
      />
      <Spacing s={24} />
      <ArrowLink
        externalLink={t('links:k')}
        accessibilityHint={t('closeContact:link3Hint')}
        accessibilityLabel={t('closeContact:link3')}
        onPress={() => handleExternal(t('links:k'))}
        textStyle={styles.arrowLinkText}
      />
      <Spacing s={24} />
      <Markdown>
        {`${t('closeContact:assistanceMessage', {
          helpline: helplineString,
          helplineNumber,
          helplineNumberTrimmed: helplineNumber.split(' ').join('')
        })}. ${closeContactAssistance}`}
      </Markdown>
      <Spacing s={32} />
      <RoundedBox style={styles.notWellBox}>
        <Markdown markdownStyles={markdownStyles}>
          {t('closeContact:notWell')}
        </Markdown>
        <Spacing s={20} />
        <Button
          variant="dark"
          onPress={() => handleExternal(t('links:e'))}
          label={t('closeContact:button1')}
          hint={t('closeContact:button1')}>
          {t('closeContact:button1')}
        </Button>
        <Spacing s={20} />
        <Markdown markdownStyles={markdownStyles}>
          {t('closeContact:notWell1')}
        </Markdown>
        <Spacing s={20} />
        <Button
          variant="dark"
          icon={TelIcon}
          onPress={() => Linking.openURL('tel:111')}
          label={t('closeContact:button2')}
          hint={t('closeContact:button2')}>
          {t('closeContact:button2')}
        </Button>
        <Spacing s={10} />
      </RoundedBox>
    </ScrollView>
  );
};

const leaderMarkdownStyles = StyleSheet.create({
  text: {
    ...text.leader
  },
  strong: {
    fontFamily: text.fontFamily.latoBold
  }
});

const textMarkdownStyles = StyleSheet.create({
  h1: {
    lineHeight: 20
  }
});

const markdownStyles = StyleSheet.create({
  // @ts-ignore
  strong: {
    ...text.h4Heading,
    color: colors.errorRed
  },
  h1: {
    ...text.h1Heading,
    marginTop: 10,
    marginBottom: 20
  },
  link: {
    ...text.default,
    color: colors.errorRed
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingLeft: 45,
    paddingRight: 45
  },
  text: {
    ...text.leader
  },
  warning: {
    ...text.h1Heading,
    color: colors.errorRed
  },
  arrowLinkContainer: {
    justifyContent: 'space-between'
  },
  arrowLinkText: {
    ...text.h4Heading,
    color: colors.darkGrey
  },
  notWellBox: {
    borderColor: colors.errorRed,
    marginBottom: 120
  }
});
