import React, {FC} from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import {useTranslation} from 'react-i18next';
import * as Haptics from 'expo-haptics';
import {useNavigation} from '@react-navigation/native';
import {useExposure} from 'react-native-exposure-notification-service';

import Markdown from '../atoms/markdown';
import {Title} from '../atoms/title';
import {Back} from '../atoms/back';
import Button from '../atoms/button';
import {useApplication} from '../../providers/context';
import {forget} from '../../services/api';
import {ScreenNames} from '../../navigation';
import {useSettings} from '../../providers/settings';
import Spacing from '../atoms/spacing';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import { useReminder } from '../../providers/reminder';

export const Leave: FC = () => {
  const {t} = useTranslation();
  const exposure = useExposure();
  const app = useApplication();
  const navigation = useNavigation();
  const {reload} = useSettings();
  const reminder = useReminder();

  const confirmed = async () => {
    try {
      try {
        await exposure.deleteAllData();
        exposure.stop();
      } catch (err) {
        console.log(err);
      }
      await forget();
      await app.clearContext();
      reminder.deleteReminder();
      reload();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      navigation.reset({
        index: 0,
        routes: [{name: ScreenNames.ageConfirmation}]
      });
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Error',
        e.message && e.message === 'Network Unavailable'
          ? t('common:networkError')
          : t('leave:error')
      );
    }
  };

  const confirm = () => {
    Alert.alert(t('leave:confirm:title'), t('leave:confirm:text'), [
      {
        text: t('leave:confirm:cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: t('leave:confirm:confirm'),
        onPress: () => confirmed(),
        style: 'destructive'
      }
    ]);
  };

  return (
    <>
      <StatusBar barStyle="default" />
      <ScrollView style={styles.container}>
        <Back variant="light" />
        <Spacing s={44} />
        <Title accessible title="leave:title" />
        <Markdown>{t('leave:body')}</Markdown>
        <Button
          style={styles.button}
          hint={t('leave:control:hint')}
          label={t('leave:control:label')}
          onPress={confirm}>
          {t('leave:control:label')}
        </Button>
        <Spacing s={44} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  },
  button: {
    marginTop: Dimensions.get('window').scale > 2 ? 24 : 12
  }
});
