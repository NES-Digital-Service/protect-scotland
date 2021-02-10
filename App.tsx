import React, {useEffect, useState} from 'react';
import {StatusBar, Platform, AppState, Image, LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import PushNotification, {
  PushNotification as PN
} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import {
  ExposureProvider,
  KeyServerType
} from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';

import './services/i18n';

import {urls} from './constants/urls';
import {Base} from './components/templates/base';
import Navigation from './components/organisms/navigation';
import {ApplicationProvider} from './providers/context';
import {useApplication} from './providers/context';
import {
  SettingsProvider,
  SettingsContext,
  useSettings
} from './providers/settings';
import {Loading} from './components/views/loading';
import {ReminderProvider} from './providers/reminder';
import {notificationHooks} from './services/notifications';
import {useAgeGroupTranslation} from './hooks';

// This hides a warning from react-native-easy-markdown which is still using componentWillReceiveProps in its latest version
LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps has been renamed, and is not recommended for use.'
]);

enableScreens();

function cacheImages(images: (string | number)[]) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const ExposureApp = ({children}: any) => {
  const [authToken, setAuthToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const {getTranslation} = useAgeGroupTranslation();

  const settings = useSettings();
  const application = useApplication();

  useEffect(() => {
    async function getTokens() {
      try {
        const storedAuthToken = (await SecureStore.getItemAsync('token')) || '';
        const storedRefreshToken =
          (await SecureStore.getItemAsync('refreshToken')) || '';

        if (storedAuthToken !== authToken) {
          setAuthToken(storedAuthToken);
        }
        if (storedRefreshToken !== refreshToken) {
          setRefreshToken(storedRefreshToken);
        }
      } catch (err) {
        console.log('error getting tokens', err);
      }
    }

    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application.user]);

  return (
    <ExposureProvider
      isReady={Boolean(
        application.user?.valid &&
          application.completedExposureOnboarding &&
          authToken &&
          refreshToken
      )}
      traceConfiguration={settings.traceConfiguration}
      serverUrl={urls.api}
      authToken={authToken}
      refreshToken={refreshToken}
      analyticsOptin={true}
      keyServerUrl={urls.api}
      keyServerType={KeyServerType.nearform}
      notificationTitle={getTranslation('closeContactNotification:title')}
      notificationDescription={getTranslation(
        'closeContactNotification:description'
      )}>
      {children}
    </ExposureProvider>
  );
};

export interface ScotlandState {
  loading: boolean;
  token?: {os: string; token: string};
  notification: PN | null;
  exposureNotificationClicked: boolean | null;
}

const App = (props: {exposureNotificationClicked: boolean | null}) => {
  const [state, setState] = React.useState<ScotlandState>({
    loading: false,
    notification: null,
    exposureNotificationClicked: props.exposureNotificationClicked
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        const imageAssets = cacheImages([
          require('./assets/images/logo/logo.png'),

          // Pre-load view-specific images so they don't flicker on Android on first load:

          // atoms/message
          require('./assets/images/symptoms/image.png'),

          // molecules/grid
          require('./assets/images/tracing/image.png'),
          require('./assets/images/tracing-inactive/image.png'),
          require('./assets/images/tracing-contact/image.png'),
          require('./assets/images/icon-comment/image.png'),
          require('./assets/images/icon-community-white/image.png'),
          require('./assets/images/icon-jar/image.png'),
          require('./assets/images/grid-paused/image.png'),

          // views/age-confirmation, views/age-under
          require('./assets/images/onboarding-logo/image.png'),
          require('./assets/images/onboarding-group/image.png'),
          require('./assets/images/wave/image.png'),

          // views/age-sorting
          require('./assets/images/age-sorting-age-group-2-illustration/image.png'),
          require('./assets/images/age-sorting-age-group-3-illustration/image.png'),

          // views/community
          require('./assets/images/icon-community-white/image.png'),
          require('./assets/images/community-illustration/image.png'),
          require('./assets/images/downloads-illustration/image.png'),

          // views/dashboard
          require('./assets/images/restrictions/image.png'),

          // views/tests
          require('./assets/images/icon-jar/image.png'),
          require('./assets/images/test-illustration/image.png'),
          require('./assets/images/icon-plus/image.png'),

          // views/tracing
          require('./assets/images/tracing-active/image.png'),
          require('./assets/images/icon-tracing-active-big/image.png'),
          require('./assets/images/icon-tracing-inactive-big/image.png'),
          require('./assets/images/tracing-illustration/image.png'),
          require('./assets/images/icon-close-green/image.png'),
          require('./assets/images/icon-paused/image.png'),

          // views/onboarding/agreement
          require('./assets/images/icon-opt-out/image.png'),

          // views/onboarding/permissions-info
          require('./assets/images/permissions-illustration/image.png'),

          // views/onboarding/privacy
          require('./assets/images/privacy-illustration/image.png'),

          // views/onboarding/test-result-modal
          require('./assets/images/test-result-modal-illustration/image.png'),
          require('./assets/images/message/android/image.png'),
          require('./assets/images/message/ios/image.png'),

          // views/onboarding/test-result
          require('./assets/images/test-result-illustration/image.png'),

          // views/onboarding/why-use
          require('./assets/images/why-use-illustration/image.png'),

          // views/onboarding/your-data-modal
          require('./assets/images/your-data-modal-illustration/image.png'),
          require('./assets/images/notification/android/age-group-1/image.png'),
          require('./assets/images/notification/android/age-group-2-3/image.png'),
          require('./assets/images/notification/ios/age-group-1/image.png'),
          require('./assets/images/notification/ios/age-group-2-3/image.png')
        ]);

        await Font.loadAsync({
          roboto: require('./assets/fonts/Roboto-Regular.ttf'),
          'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
          lato: require('./assets/fonts/Lato-Regular.ttf'),
          'lato-bold': require('./assets/fonts/Lato-Bold.ttf')
        });

        // @ts-ignore
        await Promise.all([...imageAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        console.log('done');
        setState({...state, loading: false});
      }
    }

    loadResourcesAndDataAsync();

    notificationHooks.handleNotification = async function (notification) {
      let requiresHandling = false;
      if (Platform.OS === 'ios') {
        if (
          (notification && notification.userInteraction) ||
          (AppState.currentState === 'active' && notification)
        ) {
          PushNotification.setApplicationIconBadgeNumber(0);
          requiresHandling = true;
          setTimeout(() => {
            notification.finish(
              Platform.OS === 'ios'
                ? PushNotificationIOS.FetchResult.NoData
                : ''
            );
          }, 3000);
        }
      }
      if (requiresHandling) {
        setTimeout(() => setState((s) => ({...s, notification})), 500);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      <Base>
        <StatusBar barStyle="default" />
        <SettingsProvider>
          <SettingsContext.Consumer>
            {(settingsValue) => {
              if (!settingsValue.loaded) {
                return <Loading />;
              }
              return (
                  <ApplicationProvider
                    user={settingsValue.user}
                    onboarded={settingsValue.onboarded}
                    completedExposureOnboarding={
                      settingsValue.completedExposureOnboarding
                    }>
                    <ExposureApp>
                      <ReminderProvider>
                        <StatusBar barStyle="default" />
                        <Navigation
                          notification={state.notification}
                          exposureNotificationClicked={state.exposureNotificationClicked}
                          completedExposureOnboarding={settingsValue.completedExposureOnboarding}
                          setState={setState}
                        />
                      </ReminderProvider>
                    </ExposureApp>
                  </ApplicationProvider>
              );
            }}
          </SettingsContext.Consumer>
        </SettingsProvider>
      </Base>
    </SafeAreaProvider>
  );
};

export default App;
