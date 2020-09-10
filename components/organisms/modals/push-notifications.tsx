import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Linking} from 'react-native';

import Markdown from '../../atoms/markdown';
import Modal from '../../molecules/modal';
import {text, colors} from '../../../theme';
import {ModalProps} from '../../molecules/modal';

export const PushNotificationsModal: FC<ModalProps> = (props) => {
  const {t} = useTranslation();
  return (
    <Modal
      {...props}
      title={t('modals:sendNotifications:title')}
      type="dark"
      buttons={[
        {
          variant: 'inverted',
          action: Linking.openSettings,
          hint: t('modals:sendNotifications:btnLabel'),
          label: t('modals:sendNotifications:btnLabel')
        }
      ]}>
      <Markdown markdownStyles={modalMarkdownStyles}>
        {t('modals:sendNotifications:instructions', {name: t('common:name')})}
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
