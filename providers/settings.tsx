import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import i18n, {TFunction} from 'i18next';
import {useTranslation} from 'react-i18next';
import {isObject} from 'formik';
import {TraceConfiguration} from 'react-native-exposure-notification-service';
import get from 'lodash/get';

import * as api from '../services/api';
import {requestWithCache} from '../services/api/utils';

interface SettingsContextState {
  loaded: boolean;
  latestVersion: string | null;
  traceConfiguration: TraceConfiguration;
  onboarded: boolean;
  completedExposureOnboarding: boolean;
  user: string | null;
  exposedTodo: string;
  ageLimit: number;
  dpinText: string;
  tandcText: string;
  solutionText: string;
  testingInstructions: string;
  contactTracingNumber: string;
  helplineNumber: string;
  testIsolationDuration: number;
  isolationDuration: number;
  isolationEnd: number;
  isolationCompleteDuration: number;
  isolationParagraph: string;
  copy: {
    testResult: {
      text1: string;
      text2: string;
    };
  };
  showCertUnderage: boolean;
  noticesWebPageURL: String | undefined;
}

interface SettingsContextValue extends SettingsContextState {
  reload: () => void;
}

const defaultIsolationDuration = 10;
const defaultIsolationEnd = 11;
const defaultTestIsolationDuration = 10;
const isolationCompleteDuration = 1;
const defaultIsolationParagraph = i18n.t('tests:result:label1', {
  duration: defaultTestIsolationDuration
});
const defaultAgeLimit = 16;
const defaultContactTracingNumber = i18n.t('config:contactTracingNumber');
const defaultHelplineNumber = i18n.t('config:helplineNumber');
const defaultShowCertUnderage = false;

const defaultValue: SettingsContextState = {
  loaded: false,
  user: null,
  onboarded: false,
  completedExposureOnboarding: false,
  latestVersion: null,
  traceConfiguration: {
    exposureCheckInterval: 180,
    storeExposuresFor: 14
  },
  exposedTodo: '',
  dpinText: '',
  tandcText: '',
  testIsolationDuration: defaultTestIsolationDuration,
  isolationDuration: defaultIsolationDuration,
  isolationCompleteDuration,
  isolationParagraph: defaultIsolationParagraph,
  ageLimit: defaultAgeLimit,
  isolationEnd: defaultIsolationEnd,
  solutionText: '',
  testingInstructions: '',
  helplineNumber: defaultHelplineNumber,
  contactTracingNumber: defaultContactTracingNumber,
  copy: {
    testResult: {
      text1: '',
      text2: ''
    }
  },
  showCertUnderage: defaultShowCertUnderage,
  noticesWebPageURL: undefined
};

export const SettingsContext = createContext(
  defaultValue as SettingsContextValue
);

interface SettingsProviderProps {
  children: ReactNode;
}

const loadSettingsAsync = async (
  t: TFunction,
  setState: React.Dispatch<React.SetStateAction<SettingsContextState>>
) => {
  const [
    user,
    onboarded,
    completedExposureOnboarding
  ] = await AsyncStorage.multiGet([
    'scot.user',
    'scot.onboarded',
    'scot.completedExposureOnboarding'
  ]);

  const {data: res} = await requestWithCache('scot.settings', api.loadSettings);
  const apiSettings = res ?? {};

  const tc: TraceConfiguration = {
    ...defaultValue.traceConfiguration
  };
  if (apiSettings.exposureCheckInterval) {
    tc.exposureCheckInterval = Number(apiSettings.exposureCheckInterval);
  }
  if (apiSettings.storeExposuresFor) {
    tc.storeExposuresFor = Number(apiSettings.storeExposuresFor);
  }

  const getDbText = (settings: any, key: string): string => {
    let data =
      get(settings, `${key}.${i18n.language}`) ||
      get(settings, `${key}.en`) ||
      '';

    if (isObject(data)) {
      data = Object.keys(data).map((item: string) => {
        return data[item]
          .replace(/\\n/g, '\n')
          .replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');
      });
      return data;
    } else {
      return data.replace(/\\n/g, '\n').replace(/(^|[^\n])\n(?!\n)/g, '$1\n\n');
    }
  };

  const exposedTodo =
    getDbText(apiSettings, 'exposedTodoList') || t('closeContact:todo:list');

  const dpinText =
    getDbText(apiSettings, 'dpinText') || t('dataProtectionPolicy:text');

  const tandcText =
    getDbText(apiSettings, 'tandcText') || t('tandcPolicy:text');

  const solutionText =
    getDbText(apiSettings, 'solutionText') || t('config:solutionText');

  const testingInstructions =
    getDbText(apiSettings, 'testingInstructions') ||
    t('config:testingInstructions');

  const copy = {
    testResult: {
      text1:
        getDbText(apiSettings, 'copy.testResult.text1') ||
        t('tests:result:advice') + t('tests:result:text1'),
      text2:
        getDbText(apiSettings, 'copy.testResult.text2') ||
        t('tests:result:advice') + t('tests:result:text2')
    }
  };

  setState({
    loaded: true,
    user: user[1],
    onboarded: Boolean(onboarded[1]),
    completedExposureOnboarding: Boolean(completedExposureOnboarding[1]),
    latestVersion: apiSettings.latestVersion,
    traceConfiguration: tc,
    exposedTodo,
    copy,
    dpinText,
    tandcText,
    solutionText,
    testingInstructions,
    contactTracingNumber:
      apiSettings.contactTracingNumber || defaultContactTracingNumber,
    helplineNumber: apiSettings.helplineNumber || defaultHelplineNumber,
    ageLimit: apiSettings.ageLimit
      ? Number(apiSettings.ageLimit)
      : defaultValue.ageLimit,
    isolationEnd: apiSettings.isolationEnd
      ? Number(apiSettings.isolationEnd)
      : defaultValue.isolationEnd,
    testIsolationDuration: apiSettings.testIsolationDuration
      ? Number(apiSettings.isolationDuration)
      : defaultTestIsolationDuration,
    isolationDuration: apiSettings.isolationDuration
      ? Number(apiSettings.isolationDuration)
      : defaultIsolationDuration,
    isolationCompleteDuration: apiSettings.isolationCompleteDuration
      ? Number(apiSettings.isolationCompleteDuration)
      : isolationCompleteDuration,
    isolationParagraph: apiSettings.isolationParagraph
      ? i18n.t(apiSettings.isolationParagraph, {
          duration:
            apiSettings.testIsolationDuration || defaultTestIsolationDuration
        })
      : defaultIsolationParagraph,
    showCertUnderage: apiSettings.showCertUnderage
      ? apiSettings.showCertUnderage === 'true'
      : defaultShowCertUnderage,
    noticesWebPageURL: apiSettings.noticesWebPageURL
  });
};

export const SettingsProvider: FC<SettingsProviderProps> = ({children}) => {
  const {t} = useTranslation();
  const [state, setState] = useState<SettingsContextState>(defaultValue);

  useEffect(() => {
    try {
      loadSettingsAsync(t, setState);
    } catch (err) {
      console.log(err, 'Error loading settings');
      setState((s) => ({...s, loaded: true}));
    }
  }, [t]);

  const reload = () => {
    setTimeout(() => loadSettingsAsync(t, setState), 100);
  };

  const value = {
    ...state,
    reload
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
