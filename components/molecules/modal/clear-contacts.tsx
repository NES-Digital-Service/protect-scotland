import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {useExposure} from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';

import Markdown from '../../atoms/markdown';
import Modal, {ModalProps} from '.';
import {text, colors} from '../../../theme';
import Spacing from '../../atoms/spacing';

export const ClearContactsModal: FC<ModalProps> = (props) => {
  const {t} = useTranslation();
  const {deleteExposureData, getCloseContacts} = useExposure();
  return (
    <Modal
      {...props}
      closeButton={false}
      buttons={[
        {
          action: async () => {
            try {
              await deleteExposureData();
              await getCloseContacts();
              await SecureStore.deleteItemAsync('niexposuredate');
            } catch (e) {
              console.log('Error deleting exposure data', e);
            }
          },
          hint: t('modals:clearContacts:okBtnHint'),
          label: t('modals:clearContacts:okBtnLabel')
        },
        {
          action: () => {},
          hint: t('modals:clearContacts:cancelBtnHint'),
          label: t('modals:clearContacts:cancelBtnLabel'),
          type: 'secondary'
        }
      ]}>
      <Markdown markdownStyles={modalMarkdownStyles}>
        {t('modals:clearContacts:instructions')}
      </Markdown>
      <Spacing s={20} />
    </Modal>
  );
};

const modalMarkdownStyles = StyleSheet.create({
  text: {
    ...text.leader,
    color: colors.darkGrey,
    textAlign: 'center'
  },
  block: {
    margin: 0
  }
});
