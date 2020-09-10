import React, {useEffect, useState} from 'react';
import {StatusBar, Platform, AppState, Image} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import NetInfo from '@react-native-community/netinfo';
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
import {BUILD_VERSION} from '@env';
import {useTranslation} from 'react-i18next';

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

enableScreens();

try {
  NetInfo.fetch().then((state) => console.log(state));
} catch (err) {
  console.log(err);
}

function cacheImages(images: (string | number)[]) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const ExposureApp = ({
  notification,
  exposureNotificationClicked,
  setState
}: {
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
  setState: (value: React.SetStateAction<ScotlandState>) => void;
}) => {
  const [authToken, setAuthToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const {t} = useTranslation();

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
      appVersion={BUILD_VERSION}
      serverUrl={urls.api}
      authToken={authToken}
      refreshToken={refreshToken}
      analyticsOptin={true}
      keyServerUrl={urls.api}
      keyServerType={KeyServerType.nearform}
      notificationTitle={t('closeContactNotification:title')}
      notificationDescription={t('closeContactNotification:description')}>
      <StatusBar barStyle="default" />
      <Navigation
        user={settings.user}
        notification={notification}
        exposureNotificationClicked={exposureNotificationClicked}
        completedExposureOnboarding={application.completedExposureOnboarding}
        setState={setState}
      />
    </ExposureProvider>
  );
};

export interface ScotlandState {
  loading: boolean;
  token?: {os: string; token: string};
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
}

const App = (props: {exposureNotificationClicked: Boolean | null}) => {
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
          require('./assets/images/onboarding-group/image.png'),
          require('./assets/images/map/image.png'),
          require('./assets/images/wave/image.png')
        ]);

        await Font.loadAsync({
          roboto: require('./assets/fonts/Roboto-Regular.ttf'),
          'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
          lato: require('./assets/fonts/Lato-Regular.ttf'),
          'lato-bold': require('./assets/fonts/Lato-Bold.ttf')
        });

        await Promise.all([...imageAssets]);
      } catch (e) {
        console.warn(e);
      } finally {
        console.log('done');
        setState({...state, loading: false});
      }
    }

    loadResourcesAndDataAsync();

    PushNotification.configure({
      onRegister: function () {},
      onNotification: async function (notification) {
        let requiresHandling = false;
        if (Platform.OS === 'ios') {
          console.log('iOS notification', notification, AppState.currentState);
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
          console.log('setting notification');
          setTimeout(() => setState((s) => ({...s, notification})), 500);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: false
    });
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
                  <ExposureApp
                    notification={state.notification}
                    exposureNotificationClicked={
                      state.exposureNotificationClicked
                    }
                    setState={setState}
                  />
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
