import React, {FC} from 'react';
import {StyleSheet, ScrollView, View, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useApplication} from '../../providers/context';
import {Title} from '../atoms/title';
import {Back} from '../atoms/back';
import {ModalClose} from '../atoms/modal-close';
import Markdown from '../atoms/markdown';

export const Terms: FC = () => {
  const {t} = useTranslation();
  const {user} = useApplication();

  return (
    <ScrollView style={styles.container}>
      {user && <Back />}
      {!user && (
        <View style={styles.modalClose}>
          <ModalClose />
        </View>
      )}
      <Title title="terms:title" />
      <Markdown>{t('terms:body', {link: t('links:n')})}</Markdown>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingLeft: 45,
    paddingRight: 45
  },
  modalClose: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 44
  }
});
