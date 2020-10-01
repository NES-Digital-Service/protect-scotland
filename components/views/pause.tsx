import React, {FC, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format, isBefore} from 'date-fns';
import {useExposure} from 'react-native-exposure-notification-service';

import {ModalClose} from '../atoms/modal-close';
import Markdown from '../atoms/markdown';
import {text, colors} from '../../theme';
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
      <ScrollView
        style={styles.view}
        contentContainerStyle={styles.contentContainerStyle}>
        <Text style={styles.title}>{t('pause:title')}</Text>
        <Spacing s={24} />
        <Text style={styles.body}>{t('pause:body')}</Text>
        <Spacing s={24} />
        <Markdown>{t('pause:label', {link: t('links:o')})}</Markdown>
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
  view: {
    flex: 1
  },
  header: {
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  contentContainerStyle: {
    flex: 1,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 40
  },
  title: {
    ...text.h3Heading,
    color: colors.darkGrey
  },
  body: {
    ...text.paragraph,
    color: colors.darkGrey
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
