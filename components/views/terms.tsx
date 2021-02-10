import React, {FC} from 'react';
import {StyleSheet, ScrollView, View, Platform, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useApplication} from '../../providers/context';
import {Title} from '../atoms/title';
import {Back} from '../atoms/back';
import {ModalClose} from '../atoms/modal-close';
import Markdown from '../atoms/markdown';
import Spacing from '../atoms/spacing';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';

export const Terms: FC = () => {
  const {t} = useTranslation();
  const {user} = useApplication();

  return (
    <>
      <StatusBar barStyle="default" />
      <ScrollView style={styles.container}>
        {user && <Back variant="light" />}
        {!user && (
          <View style={styles.modalClose}>
            <ModalClose />
          </View>
        )}
        <Spacing s={44} />
        <Title accessible title="terms:title" />
        <Markdown>{t('terms:body', {link: t('links:n')})}</Markdown>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  },
  modalClose: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }
});
