import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';

import {
  fallback,
  defaultNamespace,
  namespaces,
  supportedLocales
} from './common';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    callback(Localization.locale.split('-')[0]);
  },
  init: () => {},
  cacheUserLanguage: () => {}
};

i18n
  // @ts-ignore
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: fallback,
    resources: supportedLocales,
    ns: namespaces,
    defaultNS: defaultNamespace,
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
