import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, StyleSheet} from 'react-native';
import {
  useExposure,
  StatusState
} from 'react-native-exposure-notification-service';

import Markdown from '../../atoms/markdown';
import Modal, {ModalProps} from '../../molecules/modal';
import {text, colors} from '../../../theme';
import {goToSettingsAction} from '../../molecules/go-to-settings';
import {ScrollView} from 'react-native-gesture-handler';

export const ExposureNotificationsModal: FC<ModalProps> = (props) => {
  const {t} = useTranslation();
  const {status, askPermissions} = useExposure();
  const ensUnknown = status.state === StatusState.unknown;
  const ensDisabled = status.state === StatusState.disabled;

  return (
    <Modal
      {...props}
      type="dark"
      title={t('modals:exposureNotifications:title')}
      buttons={
        ensUnknown
          ? [
              {
                variant: 'inverted',
                action: async () => await askPermissions(),
                hint: t('common:turnOnBtnHint'),
                label: t('common:turnOnBtnLabel')
              }
            ]
          : [
              {
                variant: 'inverted',
                action: () => goToSettingsAction(false, askPermissions, true),
                hint: ensDisabled
                  ? t('common:turnOnBtnHint')
                  : Platform.OS === 'android'
                  ? t('common:turnOnBtnHint')
                  : t('common:goToSettingsHint'),
                label: ensDisabled
                  ? t('common:turnOnBtnLabel')
                  : Platform.OS === 'android'
                  ? t('common:turnOnBtnLabel')
                  : t('common:goToSettings')
              }
            ]
      }>
      <ScrollView>
        <Markdown markdownStyles={modalMarkdownStyles}>
          {ensUnknown
            ? t('modals:exposureNotifications:turnOn')
            : t(`modals:exposureNotifications:instructions${Platform.OS}`)}
        </Markdown>
      </ScrollView>
    </Modal>
  );
};

const modalMarkdownStyles = StyleSheet.create({
  text: {
    ...text.default,
    color: colors.white
  },
  listItemNumber: {
    color: colors.white
  }
});
