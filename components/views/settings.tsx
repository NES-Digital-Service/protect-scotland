import React, {useState, useEffect} from 'react';
import {StyleSheet, Platform, ScrollView, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {useExposure} from 'react-native-exposure-notification-service';

import {ModalHeader} from '../molecules/modal-header';
import Container from '../atoms/container';
import Text from '../atoms/text';
import {ScreenNames} from '../../navigation';
import Button from '../atoms/button';
import {ArrowLink} from '../molecules/arrow-link';
import {ClearContactsModal} from '../molecules/modal/clear-contacts';
import Spacing from '../atoms/spacing';
import {SPACING_BOTTOM, SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HIDE_DEBUG} from '@env';
import {useVersion} from '../../hooks/version';

const ArrowIcon = require('../../assets/images/icon-arrow-white/image.png');
const SettingsIcon = require('../../assets/images/icon-settings-white/image.png');

const REQUIRED_PRESS_COUNT = 3;
const SIMULATION_DELAY = 3;
const SIMULATE_DAYS = 5;

export const Settings = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [clear, setClear] = useState(false);
  const version = useVersion();
  const {contacts, getCloseContacts, simulateExposure} = useExposure();
  const [simulated, setSimulated] = useState(false);
  const insets = useSafeAreaInsets();
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [pressCount, setPressCount] = useState<number>(0);

  const headingPressHandler = async () => {
    if (HIDE_DEBUG === 'y') {
      return;
    }
    setPressCount(pressCount + 1);
    if (!showDebug && pressCount + 1 >= REQUIRED_PRESS_COUNT) {
      await AsyncStorage.setItem('cti.showDebug', 'y');
      setShowDebug(true);
    }
  };

  useEffect(() => {
    if (HIDE_DEBUG === 'y') {
      return;
    }
    setTimeout(getCloseContacts, (SIMULATION_DELAY + 0.5) * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulated]);

  useEffect(() => {
    const init = async () => {
      try {
        const showDebugData = await AsyncStorage.getItem('cti.showDebug');
        if (showDebugData && HIDE_DEBUG !== 'y') {
          setShowDebug(showDebugData === 'y');
        }
      } catch (err) {
        console.log('Error reading "cti.showDebug" from async storage:', err);
      }
    };
    init();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: insets.bottom + SPACING_BOTTOM}
      ]}>
      <StatusBar barStyle="light-content" />
      <ModalHeader
        heading="settings:title"
        color="white"
        icon={SettingsIcon}
        action={headingPressHandler}
      />
      <Spacing s={65} />
      <Container>
        <ArrowLink
          onPress={() => navigation.navigate(ScreenNames.terms)}
          accessibilityHint={t('settings:terms:hint')}
          fullWidth
          icon={ArrowIcon}>
          <Text variant="leader" color="white">
            {t('settings:terms:label')}
          </Text>
        </ArrowLink>

        <Spacing s={30} />

        <ArrowLink
          onPress={() => navigation.navigate(ScreenNames.dataPolicy)}
          accessibilityHint={t('settings:data:hint')}
          fullWidth
          icon={ArrowIcon}>
          <Text variant="leader" color="white">
            {t('settings:data:label')}
          </Text>
        </ArrowLink>

        <Spacing s={30} />

        <ArrowLink
          onPress={() => navigation.navigate(ScreenNames.leave)}
          accessibilityHint={t('settings:leave:hint')}
          fullWidth
          icon={ArrowIcon}>
          <Text variant="leader" color="white">
            {t('settings:leave:label')}
          </Text>
        </ArrowLink>

        {showDebug && (
          <>
            <Spacing s={30} />
            <ArrowLink
              onPress={() => navigation.navigate(ScreenNames.debug)}
              accessibilityHint={t('settings:debug:hint')}
              fullWidth
              icon={ArrowIcon}>
              <Text variant="leader" color="white">
                {t('settings:debug:label')}
              </Text>
            </ArrowLink>
          </>
        )}

        {showDebug && (
          <>
            <Spacing s={30} />
            <ArrowLink
              onPress={() => {
                simulateExposure(SIMULATION_DELAY, SIMULATE_DAYS);
                setSimulated(true);
              }}
              accessibilityHint={t('settings:sim:hint')}
              fullWidth
              icon={ArrowIcon}>
              <Text variant="leader" color="white">
                {t('settings:sim:label')}
              </Text>
            </ArrowLink>
          </>
        )}

        {contacts && contacts.length > 0 && (
          <>
            <Spacing s={60} />
            <Text light align="center">
              {t('settings:clearData:message')}
            </Text>
            <Spacing s={20} />
            <Button
              variant="inverted"
              label={t('settings:clearData:action:label')}
              hint={t('settings:clearData:action:hint')}
              onPress={() => {
                setClear(true);
              }}>
              {t('settings:clearData:action:label')}
            </Button>
          </>
        )}
      </Container>
      {clear && (
        <ClearContactsModal
          onClose={() => {
            setClear(false);
            setSimulated(false);
          }}
          onBackButtonPress={() => setClear(false)}
        />
      )}
      {!!version && (
        <>
          <Spacing s={24} />
          <Text
            light
            align="center"
            accessibilityHint={t('common:version', {version: version.display})}>
            App version: {version.display}
          </Text>
          <Spacing s={20} />
        </>
      )}
      <Spacing s={50} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  }
});
