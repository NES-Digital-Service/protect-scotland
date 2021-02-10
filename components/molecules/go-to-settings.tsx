import React, {FC} from 'react';
import {Linking, Platform} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import {
  useExposure,
  StatusState,
  StatusType,
  AuthorisedStatus
} from 'react-native-exposure-notification-service';

import Button from '../atoms/button';
import {useTranslation} from 'react-i18next';

export const goToSettingsAction = async (
  bluetoothDisabled?: boolean,
  askPermissions?: () => Promise<void>
) => {
  try {
    if (Platform.OS === 'ios') {
      Linking.openSettings();
    } else {
      bluetoothDisabled
        ? await IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_SETTINGS
          )
        : await askPermissions!();
    }
  } catch (err) {
    console.log('Error handling go to settings', err);
  }
};

const GoToSettings: FC = () => {
  const {t} = useTranslation();
  const {status, askPermissions, isAuthorised} = useExposure();
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';

  const bluetoothDisabled =
    status.state === StatusState.disabled &&
    status.type?.includes(StatusType.bluetooth);

  const ensUnknown = status.state === StatusState.unknown;
  const ensDisabled = status.state === StatusState.disabled;
  const notAuthorised = isAuthorised === AuthorisedStatus.unknown;

  return (
    <Button
      variant="dark"
      rounded
      onPress={async () =>
        ensUnknown || notAuthorised
          ? await askPermissions()
          : goToSettingsAction(bluetoothDisabled, askPermissions)
      }
      label={
        ensUnknown || notAuthorised
          ? t('common:turnOnBtnLabel')
          : ensDisabled
          ? t('common:turnOnBtnLabel')
          : platform === 'android'
          ? t('common:turnOnBtnLabel')
          : t('common:goToSettings')
      }
      hint={
        ensUnknown || notAuthorised
          ? t('common:turnOnBtnHint')
          : ensDisabled
          ? t('common:turnOnBtnHint')
          : platform === 'android'
          ? t('common:turnOnBtnHint')
          : t('common:goToSettingsHint')
      }>
      {ensUnknown || notAuthorised
        ? t('common:turnOnBtnLabel')
        : ensDisabled
        ? t('common:turnOnBtnLabel')
        : platform === 'android'
        ? t('common:turnOnBtnLabel')
        : t('common:goToSettings')}
    </Button>
  );
};

export default GoToSettings;
