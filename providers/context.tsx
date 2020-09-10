import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback
} from 'react';
import {AccessibilityInfo} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as SecureStore from 'expo-secure-store';
import {loadData, StatsData} from '../services/api';

export interface Accessibility {
  reduceMotionEnabled: boolean;
  screenReaderEnabled: boolean;
}

export interface User {
  valid: boolean;
  tracking?: any[];
}

interface State {
  initializing: boolean;
  onboarded: boolean;
  completedExposureOnboarding: boolean;
  loading: boolean | string;
  data?: StatsData | null;
  user?: User;
  accessibility: Accessibility;
}

interface ApplicationContextValue extends State {
  uploadRequired?: boolean;
  setContext: (data: any) => Promise<void>;
  clearContext: () => Promise<void>;
  loadAppData: () => Promise<void>;
}

const initialState = {
  initializing: true,
  loading: false,
  user: undefined,
  onboarded: false,
  completedExposureOnboarding: false,
  accessibility: {
    reduceMotionEnabled: false,
    screenReaderEnabled: false
  }
};

export const ApplicationContext = createContext(
  initialState as ApplicationContextValue
);

export interface API {
  user: string | null;
  onboarded: boolean;
  completedExposureOnboarding: boolean;
  children: any;
}

export const AP = ({
  user,
  onboarded,
  completedExposureOnboarding,
  children
}: API) => {
  const [state, setState] = useState<State>({
    initializing: true,
    loading: false,
    user: (user && JSON.parse(user as string)) || null,
    onboarded,
    completedExposureOnboarding,
    accessibility: {
      reduceMotionEnabled: false,
      screenReaderEnabled: false
    }
  });

  const handleReduceMotionChange = (reduceMotionEnabled: boolean): void => {
    setState((s) => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        reduceMotionEnabled: reduceMotionEnabled
      }
    }));
  };

  const handleScreenReaderChange = (screenReaderEnabled: boolean): void => {
    setState((s) => ({
      ...s,
      accessibility: {
        ...s.accessibility,
        screenReaderEnabled
      }
    }));
  };

  useEffect(() => {
    AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      handleReduceMotionChange
    );
    AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      handleScreenReaderChange
    );

    AccessibilityInfo.isReduceMotionEnabled().then(handleReduceMotionChange);
    AccessibilityInfo.isScreenReaderEnabled().then(handleScreenReaderChange);

    return () => {
      AccessibilityInfo.removeEventListener(
        'reduceMotionChanged',
        handleReduceMotionChange
      );
      AccessibilityInfo.removeEventListener(
        'screenReaderChanged',
        handleScreenReaderChange
      );
    };
  }, []);

  const setContext = async (data: Partial<State>) => {
    setState((s) => ({...s, ...data}));
    if (data.user) {
      await AsyncStorage.setItem('scot.user', JSON.stringify(data.user));
    }
    if (data.completedExposureOnboarding) {
      await AsyncStorage.setItem('scot.completedExposureOnboarding', 'y');
    }
  };

  const clearContext = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('uploadToken');
    await SecureStore.deleteItemAsync('niexposuredate');
    await AsyncStorage.removeItem('scot.user');
    await AsyncStorage.removeItem('scot.showDebug');
    await AsyncStorage.removeItem('scot.onboarded');
    await AsyncStorage.removeItem('scot.completedExposureOnboarding');
    await AsyncStorage.removeItem('analyticsConsent');

    setState((s) => ({
      ...s,
      onboarded: false,
      completedExposureOnboarding: false,
      user: undefined
    }));
  };

  const loadAppData = async () => {
    try {
      const data = await loadData();
      setState((s) => ({...s, loading: false, data}));
      return true;
    } catch (err) {
      setState((s) => ({...s, loading: false, data: null}));
      console.log('Error loading app data: ', err);
      console.log(err);
      return err;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadAppDataRef = useCallback(loadAppData, [loadData]);

  const value: ApplicationContextValue = {
    ...state,
    setContext,
    clearContext,
    loadAppData: loadAppDataRef
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const ApplicationProvider = AP;

export const useApplication = () => useContext(ApplicationContext);
