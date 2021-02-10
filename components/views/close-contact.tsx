import React, {FC, Fragment, useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Platform, Linking, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useExposure} from 'react-native-exposure-notification-service';
import {format} from 'date-fns';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation
} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import {
  getSelfIsolationRemainingDays,
  getExposureDate,
  DATE_FORMAT,
  getIsolationEndDate
} from '../../utils/exposure';

import {ModalHeader} from '../molecules/modal-header';
import Text from '../atoms/text';
import Spacing from '../atoms/spacing';
import Button from '../atoms/button';
import Divider from '../atoms/divider';
import Markdown from '../atoms/markdown';
import RoundedBox from '../atoms/rounded-box';
import {text, colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {ArrowLink} from '../molecules/arrow-link';
import CloseContactStep from '../molecules/close-contact-step';
import {useSettings} from '../../providers/settings';
import PushNotification from 'react-native-push-notification';
import {useApplication, UserAgeGroup} from '../../providers/context';
import {openBrowserAsync} from '../../utils/web-browser';
import {useAgeGroupTranslation} from '../../hooks';
import {ScreenNames} from '../../navigation';
import {validateNoticeKey} from '../../services/api';

const TelIcon = require('../../assets/images/icon-tel/image.png');

interface CloseContactProps {}

export const CloseContact: FC<CloseContactProps> = () => {
  const {t} = useTranslation();
  const {getTranslation} = useAgeGroupTranslation();
  const navigation = useNavigation();
  const {contacts, getCloseContacts} = useExposure();
  const isFocused = useIsFocused();
  const {
    isolationDuration,
    testingInstructions,
    helplineNumber,
    showCertUnderage
  } = useSettings();
  const [showSendNotice, setShowSendNotice] = useState(false);

  PushNotification.setApplicationIconBadgeNumber(0);

  const exposureDate = getExposureDate(contacts);

  const remainingDays = getSelfIsolationRemainingDays(
    isolationDuration,
    contacts
  );

  const {
    accessibility: {screenReaderEnabled},
    user: {ageGroup = UserAgeGroup.ageGroup1} = {}
  } = useApplication();

  useEffect(() => {
    getCloseContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = [
    {
      title: t('closeContact:nextSteps:step1:title'),
      text: getTranslation('closeContact:nextSteps:step1:text'),
      link: t('links:d'),
      linkText: getTranslation('closeContact:nextSteps:step1:link')
    },
    {
      title: t('closeContact:nextSteps:step2:title'),
      text: t('closeContact:nextSteps:step2:text'),
      link: t('links:s'),
      linkText: t('closeContact:nextSteps:step2:link')
    },
    {
      title: t('closeContact:nextSteps:step3:title'),
      text: t('closeContact:nextSteps:step3:text'),
      link: t('links:t'),
      linkText: t('closeContact:nextSteps:step3:link')
    },
    {
      title: t('closeContact:nextSteps:step4:title'),
      text: t('closeContact:nextSteps:step4:text')
    },
    {
      title: t('closeContact:nextSteps:step5:title'),
      text: (
        <Markdown
          markdownStyles={markdownStylesBlock}
          accessibleLink={`tel:${helplineNumber.split(' ').join('')}`}>
          {getTranslation('closeContact:nextSteps:step5:text', {
            helplineNumber,
            helplineNumberTrimmed: helplineNumber.split(' ').join('')
          })}
        </Markdown>
      )
    }
  ];

  useFocusEffect(
    useCallback(() => {
      const getCertificateKey = async () => {
        try {
          const selfIsolationEndDate = getIsolationEndDate(
            isolationDuration,
            contacts,
            'yyyy-MM-dd'
          );

          const data = await SecureStore.getItemAsync('createNoticeCertKey');

          if (data) {
            const {key, selfIsolationDate} = JSON.parse(data);

            if (key && selfIsolationDate) {
              if (selfIsolationDate !== selfIsolationEndDate?.formatted) {
                return setShowSendNotice(true);
              }

              const isValidKey = await validateNoticeKey(key);

              return setShowSendNotice(Boolean(isValidKey));
            }
          }

          setShowSendNotice(true);
        } catch (err) {
          console.log('Error retrieving createNoticeCertKey', err);

          setShowSendNotice(false);
        }
      };

      if (!isFocused) {
        return;
      }
      getCertificateKey();
    }, [isFocused, contacts, isolationDuration])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ModalHeader type="inline" heading={t('closeContact:title')} />
        <Text variant="h1" color="errorRed">
          {getTranslation('closeContact:warning', {
            days: remainingDays
          })}
        </Text>
        <Spacing s={32} />
        <Markdown>
          {getTranslation('closeContact:body1', {
            days: remainingDays,
            date: exposureDate ? format(exposureDate, DATE_FORMAT) : undefined
          })}
        </Markdown>
      </View>
      {ageGroup !== UserAgeGroup.ageGroup1 && <Spacing s={24} />}

      <Divider color="white" />
      <View style={styles.content}>
        <Spacing s={24} />
        <ArrowLink
          externalLink={t('links:c')}
          accessibilityHint={t('closeContact:link1Hint')}>
          <Text variant="h4" color="primaryPurple">
            {t('closeContact:link1')}
          </Text>
        </ArrowLink>
        <Spacing s={24} />
      </View>
      <Divider color="white" />

      <View style={styles.content}>
        <Spacing s={50} />
        <Text variant="h3" color="errorRed">
          {t('closeContact:nextSteps:title')}
        </Text>
        <Spacing s={23} />
        {ageGroup !== UserAgeGroup.ageGroup1 && (
          <Text>{t('closeContact:nextSteps:intro')}</Text>
        )}
        <Spacing s={32} />

        {steps.map(({...step}, i) => (
          <Fragment key={i}>
            <CloseContactStep number={i + 1} {...step} />
            <Spacing s={i === steps.length - 1 ? 24 : 40} />
          </Fragment>
        ))}

        {showSendNotice &&
          (ageGroup === UserAgeGroup.ageGroup1 ? true : showCertUnderage) && (
            <>
              <Spacing s={20} />
              <RoundedBox style={styles.sendNoticeBox}>
                <Spacing s={10} />
                <Markdown markdownStyles={markdownStyles}>
                  {t('closeContact:sendNotice:text')}
                </Markdown>
                <Button
                  variant="dark"
                  onPress={() => navigation.navigate(ScreenNames.sendNotice)}
                  label={t('closeContact:sendNotice:button')}
                  hint={t('closeContact:sendNotice:button')}>
                  {t('closeContact:sendNotice:button')}
                </Button>
                <Spacing s={10} />
              </RoundedBox>
              <Spacing s={50} />
            </>
          )}

        {ageGroup === UserAgeGroup.ageGroup1 && (
          <>
            <ArrowLink externalLink={t('links:k')}>
              <Text variant="h4" color="primaryPurple">
                {t('closeContact:link3')}
              </Text>
            </ArrowLink>
            <Spacing s={40} />
          </>
        )}

        <Markdown>{testingInstructions}</Markdown>
      </View>

      <Spacing s={8} />
      <View style={styles.content}>
        <RoundedBox style={styles.notWellBox}>
          <Spacing s={10} />
          <Markdown markdownStyles={markdownStyles}>
            {t('closeContact:notWell')}
          </Markdown>
          <Spacing s={20} />
          <Button
            variant="dark"
            onPress={() => openBrowserAsync(t('links:e'))}
            label={t('closeContact:button1')}
            hint={t('closeContact:button1')}>
            {t('closeContact:button1')}
          </Button>
          <Spacing s={20} />
          <Markdown markdownStyles={markdownStyles}>
            {t('closeContact:notWell1', {
              phone: screenReaderEnabled
                ? t('closeContact:accessiblePhoneLink')
                : t('closeContact:phoneLink')
            })}
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
      </View>
    </ScrollView>
  );
};

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

const markdownStylesBlock = StyleSheet.create({
  block: {
    margin: 0
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 65 : 30
  },
  content: {paddingHorizontal: SPACING_HORIZONTAL},
  sendNoticeBox: {
    borderColor: colors.errorRed
  },
  notWellBox: {
    borderColor: colors.errorRed,
    marginBottom: 120
  }
});
