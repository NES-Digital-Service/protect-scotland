import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useTranslation} from 'react-i18next';
import PushNotification from 'react-native-push-notification';
import {addDays} from 'date-fns';
import {
  StatusState, useExposure
} from 'react-native-exposure-notification-service';

interface State {
  paused: string | null;
  checked: boolean;
}

interface ReminderContextValue extends State {
  setReminder: (date: Date) => void;
  deleteReminder: () => void;
  cancelReminder: () => void;
}

const initialState = {
  paused: null,
  checked: false
};

export const ReminderContext = createContext(
  initialState as ReminderContextValue
);

export interface API {
  children: any;
}

const REMINDER_KEY = 'ni.reminder';
const REMINDER_ID = 12345;

export const Provider = ({children}: API) => {
  const [state, setState] = useState<State>(initialState);
  const {t} = useTranslation();
  const exposure = useExposure();

  useEffect(() => {
    const checkRunning = async () => {
      AsyncStorage.getItem(REMINDER_KEY).then((paused) => {
        setState({
          paused: paused && exposure.status.state !== StatusState.active ? paused : null,
          checked: true
        })
      });
    };

    checkRunning(); 
  }, [exposure.status.state]);

  const cancelReminder = () =>
    PushNotification.cancelLocalNotifications({id: String(REMINDER_ID)});

  const deleteReminder = () => {
    PushNotification.cancelLocalNotifications({id: String(REMINDER_ID)});
    AsyncStorage.removeItem(REMINDER_KEY);
    setState({
      ...state,
      paused: null
    });
  };

  const setReminder = (date: Date) => {
    const currentDate = new Date();
    const notificationDate = date < currentDate ? addDays(date, 1) : date;
    const timestamp = String(notificationDate.getTime());
    AsyncStorage.setItem(REMINDER_KEY, timestamp);

    PushNotification.localNotificationSchedule({
      channelId: 'default',
      id: REMINDER_ID,
      title: t('reminder:title'),
      message: t('reminder:message'),
      date: notificationDate,
      repeatType: 'hour',
      // @ts-ignore
      allowWhileIdle: true
    });

    setState({
      ...state,
      paused: timestamp
    });
  };

  const value: ReminderContextValue = {
    ...state,
    setReminder,
    deleteReminder,
    cancelReminder
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};

export const ReminderProvider = Provider;

export const useReminder = () => useContext(ReminderContext);
