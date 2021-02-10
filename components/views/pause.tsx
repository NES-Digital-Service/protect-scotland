import React, {FC, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format, isBefore} from 'date-fns';
import {useExposure} from 'react-native-exposure-notification-service';

import Text from '../atoms/text';
import {ModalClose} from '../atoms/modal-close';
import Markdown from '../atoms/markdown';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import Spacing from '../atoms/spacing';
import Button from '../atoms/button';
import {useReminder} from '../../providers/reminder';

const getClosestInterval = (interval: number) => {
  const ms = 1000 * 60 * interval;
  return new Date(Math.ceil(new Date().getTime() / ms) * ms);
};

export const Pause: FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {pause} = useExposure();
  const [selectedInterval, setSelectedInterval] = useState<Date>(
    getClosestInterval(15)
  );
  const [selected, setSelected] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const {setReminder} = useReminder();

  return (
    <>
      <View style={styles.header}>
        <ModalClose onPress={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text variant="h3" color="darkGrey">
          {t('pause:title')}
        </Text>
        <Spacing s={24} />
        <Text color="darkGrey">{t('pause:body')}</Text>
        <Spacing s={24} />
        <Markdown accessibleLink={t('links:o')}>
          {t('pause:label', {link: t('links:o')})}
        </Markdown>
        <Spacing s={24} />
        <Button
          type="secondary"
          variant="green"
          rounded
          buttonStyle={styles.smallButton}
          onPress={() => setShow(true)}>
          {!selected ? (
            t('pause:setTimeButton')
          ) : (
            <>
              {format(selectedInterval, 'HH:mm')}{' '}
              {isBefore(selectedInterval, new Date())
                ? t('common:tomorrow')
                : t('common:today')}
            </>
          )}
        </Button>
        <DateTimePickerModal
          isVisible={show}
          mode="time"
          display="spinner"
          minuteInterval={15}
          date={selectedInterval}
          onConfirm={(e) => {
            setShow(false);
            setSelectedInterval(e);
            setSelected(true);
          }}
          onCancel={() => setShow(false)}
          headerTextIOS={t('pause:modalHeader')}
        />
        <Spacing s={18} />
        <Button
          type="primary"
          variant="green"
          rounded
          onPress={() => {
            pause();
            setReminder(selectedInterval);
            navigation.goBack();
          }}>
          {t('pause:button')}
        </Button>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: SPACING_HORIZONTAL,
    paddingBottom: 40
  },
  buttonContainer: {
    justifyContent: 'flex-end'
  },
  smallButton: {
    minHeight: 50
  },
  picker: {
    width: '100%',
    height: 600,
    marginTop: -70
  }
});
