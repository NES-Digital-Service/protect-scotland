import React, {FC, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  StatusBar
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';
import {useExposure} from 'react-native-exposure-notification-service';

import Layouts from '../../../theme/layouts';
import WhyUse from './why-use';
import YourData from './your-data';
import TestResult from './test-result';
import PermissionsInfo from './permissions-info';
import PrivacyInfo from './privacy';
import TermsNotice from './terms-notice';
import UpgradeNotice from './upgrade-notice';
import {colors} from '../../../theme';
import {register} from '../../../services/api';
import {useApplication} from '../../../providers/context';
import PrivacyAgreement from './agreement';
import { useAppState } from '../../../hooks';

enum OnboardingStatus {
  'whyUse' = 1,
  'yourData' = 2,
  'testResult' = 3,
  'privacy' = 4,
  'termsNotice' = 5,
  'termsAgreement' = 6,
  'permissionsInfo' = 7,
  'upgradeNotice' = 7.1
}

const onboardingBackgrounds: {[key in OnboardingStatus]?: string} = {
  [OnboardingStatus.whyUse]: colors.lighterPurple,
  [OnboardingStatus.yourData]: colors.backgroundYellow,
  [OnboardingStatus.testResult]: colors.errorRedTint,
  [OnboardingStatus.privacy]: colors.lightGrey,
  [OnboardingStatus.termsNotice]: colors.darkerPurple,
  [OnboardingStatus.termsAgreement]: colors.darkerPurple,
  [OnboardingStatus.permissionsInfo]: colors.darkerPurple,
  [OnboardingStatus.upgradeNotice]: colors.darkerPurple
};

interface State {
  page: OnboardingStatus;
  slideInX: Animated.Value;
  error: string | null;
  loading: boolean;
}

interface OnboardingProps {
  navigation: StackNavigationProp<any>;
}

const width = Dimensions.get('window').width;
const ANIMATION_DURATION = 200;

export const Onboarding: FC<OnboardingProps> = ({navigation}) => {
  const {t} = useTranslation();
  const exposure = useExposure();
  const app = useApplication();
  const [status, setStatus] = useState<State>({
    page: 1,
    slideInX: new Animated.Value(width),
    error: null,
    loading: false
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const [appState] = useAppState();
  
  if (appState !== 'active' && status.loading) {
    setStatus((s) => ({...s, loading: false}));
  }

  useEffect(() => {
    Animated.timing(status.slideInX, {
      toValue: 0,
      duration: app.accessibility.reduceMotionEnabled ? 0 : ANIMATION_DURATION,
      useNativeDriver: true
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleNext = () => {
    setStatus((s) => ({
      ...s,
      page: status.page + 1,
      slideInX: new Animated.Value(width)
    }));
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: false});
  };
 
  const registerAndProceed = async () => {
    try {
      setStatus((s) => ({...s, loading: true}));
      const {token, refreshToken} = await register();
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken, {});
      await app.setContext({
        user: {
          new: true,
          valid: true
        }
      });

      const nextPage = exposure.supported
        ? OnboardingStatus.permissionsInfo
        : OnboardingStatus.upgradeNotice;

      setStatus((s) => ({
        ...s,
        page: nextPage,
        slideInX: new Animated.Value(width),
        loading: false
      }));
      scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: false});
    } catch (err) {
      console.log('Error registering device: ', err);
      console.log('Error code:', err.code);
      let title = t('common:tryAgain:timestampTitle');
      let description = t('common:tryAgain:timestamp');
      try {
        const response = JSON.parse(await err.text());
        console.log(response);
        if (err.message === 'Network Unavailable') {
          title = t('common:tryAgain:title');
          description = t('common:tryAgain:description');
        }
      } catch (e) {
        console.log('Error processing response');
      }

      Alert.alert(title, description, [
        {
          text: t('common:ok:label'),
          style: 'default',
          onPress: () =>
            setStatus((s) => ({
              ...s,
              loading: false
            }))
        }
      ]);
    }
  };

  const goBack = () => {
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: false});

    return status.page === 1
      ? navigation.pop()
      : setStatus((s) => ({
          ...s,
          page: Math.round(status.page - 1),
          slideInX: new Animated.Value(-width)
        }));
  };

  return (
    <>
      <StatusBar
        barStyle={
          status.page < OnboardingStatus.termsNotice
            ? 'default'
            : 'light-content'
        }
      />
      <Layouts.OnboardingWithNavbar
        canGoBack={status.page !== 1 || navigation.canGoBack()}
        goBack={goBack}
        sections={Object.keys(OnboardingStatus).length / 2}
        activeSection={Math.round(status.page)}
        backgroundColor={onboardingBackgrounds[status.page]}
        scrollViewRef={scrollViewRef}>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateX: status.slideInX}]},
            {minHeight: Dimensions.get('window').height - 190}
          ]}>
          {status.page === OnboardingStatus.whyUse && (
            <WhyUse handleNext={handleNext} />
          )}
          {status.page === OnboardingStatus.yourData && (
            <YourData handleNext={handleNext} />
          )}
          {status.page === OnboardingStatus.testResult && (
            <TestResult handleNext={handleNext} />
          )}
          {status.page === OnboardingStatus.privacy && (
            <PrivacyInfo handleNext={handleNext} />
          )}
          {status.page === OnboardingStatus.termsNotice && (
            <TermsNotice handleNext={handleNext} navigation={navigation} />
          )}
          {status.page === OnboardingStatus.termsAgreement && (
            <PrivacyAgreement
              disabled={status.loading}
              handleNext={registerAndProceed}
            />
          )}
          {status.page === OnboardingStatus.permissionsInfo && (
            <PermissionsInfo navigation={navigation} />
          )}
          {status.page === OnboardingStatus.upgradeNotice && <UpgradeNotice />}
        </Animated.View>
        {status.loading && (
          <Spinner
            animation="fade"
            visible
            overlayColor={'rgba(0, 0, 0, 0.5)'}
          />
        )}
      </Layouts.OnboardingWithNavbar>
    </>
  );
};

const styles = StyleSheet.create({
  animatedView: {flex: 1}
});
