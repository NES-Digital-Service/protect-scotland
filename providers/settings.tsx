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

import * as api from '../services/api';

interface SettingsContextState {
  loaded: boolean;
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
  helplineString: string;
  closeContactAssistance: string;
  testIsolationDuration: number;
  isolationDuration: number;
  isolationEnd: number;
  isolationCompleteDuration: number;
  isolationParagraph: string;
}

interface SettingsContextValue extends SettingsContextState {
  reload: () => void;
}

const defaultIsolationDuration = 14;
const defaultIsolationEnd = 15;
const defaultTestIsolationDuration = 10;
const isolationCompleteDuration = 1;
const defaultIsolationParagraph = i18n.t('tests:result:label1', {
  duration: defaultTestIsolationDuration
});
const defaultAgeLimit = 16;
const defaultContactTracingNumber = i18n.t('config:contactTracingNumber');
const defaultHelplineNumber = i18n.t('config:helplineNumber');
const defaultHelplineString = i18n.t('config:helplineString');
const defaultCloseContactAssistance = i18n.t('config:closeContactAssistance', {
  link: i18n.t('links:m')
});

const defaultValue: SettingsContextState = {
  loaded: false,
  user: null,
  onboarded: false,
  completedExposureOnboarding: false,
  traceConfiguration: {
    exposureCheckInterval: 120,
    storeExposuresFor: 14,
    fileLimit: 1,
    fileLimitiOS: 3
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
  helplineString: defaultHelplineString,
  closeContactAssistance: '',
  contactTracingNumber: defaultContactTracingNumber
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

  let apiSettings;
  try {
    apiSettings = await api.loadSettings();
    console.log(apiSettings);
  } catch (e) {
    console.log('Error loading settings: ', e);
    apiSettings = {};
  }

  const tc: TraceConfiguration = {
    ...defaultValue.traceConfiguration
  };
  if (apiSettings.exposureCheckInterval) {
    tc.exposureCheckInterval = Number(apiSettings.exposureCheckInterval);
  }
  if (apiSettings.storeExposuresFor) {
    tc.storeExposuresFor = Number(apiSettings.storeExposuresFor);
  }
  if (apiSettings.fileLimit) {
    tc.fileLimit = Number(apiSettings.fileLimit);
  }
  if (apiSettings.fileLimitiOS) {
    tc.fileLimitiOS = Number(apiSettings.fileLimitiOS);
  }

  const getDbText = (settings: any, key: string): string => {
    let data =
      (settings[key] && (settings[key][i18n.language] || settings[key].en)) ||
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

  const helplineString =
    getDbText(apiSettings, 'helplineString') || t('config:helplineString');

  setState({
    loaded: true,
    user: user[1],
    onboarded: Boolean(onboarded[1]),
    completedExposureOnboarding: Boolean(completedExposureOnboarding[1]),
    traceConfiguration: tc,
    exposedTodo,
    dpinText,
    tandcText,
    solutionText,
    testingInstructions,
    contactTracingNumber:
      apiSettings.contactTracingNumber || defaultContactTracingNumber,
    helplineNumber: apiSettings.helplineNumber || defaultHelplineNumber,
    helplineString,
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
    closeContactAssistance: apiSettings.closeContactAssistance
      ? t(getDbText(apiSettings, 'closeContactAssistance'), {
          link: t('links:m')
        })
      : defaultCloseContactAssistance
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
