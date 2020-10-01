import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';

import Markdown from '../../atoms/markdown';
import Modal from '../../molecules/modal';
import {text, colors} from '../../../theme';
import {ModalProps} from '../../molecules/modal';
import {goToSettingsAction} from '../../molecules/go-to-settings';

export const BluetoothNotificationsModal: FC<ModalProps> = (props) => {
  const {t} = useTranslation();
  return (
    <Modal
      {...props}
      title={t('modals:bluetoothNotifications:title')}
      type="dark"
      buttons={[
        {
          variant: 'inverted',
          action: () => goToSettingsAction(true),
          hint: t('modals:bluetoothNotifications:btnLabel'),
          label: t('modals:bluetoothNotifications:btnLabel')
        }
      ]}>
      <Markdown markdownStyles={modalMarkdownStyles}>
        {t('modals:bluetoothNotifications:instructions')}
      </Markdown>
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
