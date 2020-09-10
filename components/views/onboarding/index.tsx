import React, {FC, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  findNodeHandle,
  AccessibilityInfo
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';
import {useExposure} from 'react-native-exposure-notification-service';

import Layouts from '../../../theme/layouts';
import WhyUse from './why-use';
import YourData from './your-data';
import PermissionsInfo from './permissions-info';
import PrivacyInfo from './privacy';
import UpgradeNotice from './upgrade-notice';
import Spacing from '../../atoms/spacing';
import {text, colors} from '../../../theme';
import {register} from '../../../services/api';
import {useApplication} from '../../../providers/context';
import PrivacyAgreement from './agreement';

enum OnboardingStatus {
  'whyUse' = 1,
  'yourData' = 2,
  'privacy' = 3,
  'agreement' = 4,
  'permissionsInfo' = 5,
  'upgradeNotice' = 5.1
}

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
  const focusStart = useRef<any>();

  useEffect(() => {
    if (app.accessibility.screenReaderEnabled && focusStart.current) {
      const tag = findNodeHandle(focusStart.current);
      if (tag) {
        setTimeout(() => AccessibilityInfo.setAccessibilityFocus(tag), 250);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.timing(status.slideInX, {
      toValue: 0,
      duration: app.accessibility.reduceMotionEnabled ? 0 : ANIMATION_DURATION,
      useNativeDriver: true
    }).start(() => {
      if (app.accessibility.screenReaderEnabled && focusStart.current) {
        const tag = findNodeHandle(focusStart.current);
        if (tag) {
          setTimeout(() => AccessibilityInfo.setAccessibilityFocus(tag), 250);
        }
      }
    });
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
      console.log('Error registering device: ', err, typeof err, err.message);
      const [title, description] =
        err.message === 'Invalid timestamp'
          ? [
              t('onboarding:timestampError:title'),
              t('onboarding:timestampError:description')
            ]
          : [t('common:tryAgain:title'), t('common:tryAgain:description')];

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
    setStatus((s) => ({
      ...s,
      page: Math.round(status.page - 1),
      slideInX: new Animated.Value(-width)
    }));

    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: false});
  };

  const os = Platform.OS === 'ios' ? 'ios' : 'android';

  return (
    <Layouts.OnboardingWithNavbar
      canGoBack={
        status.page === OnboardingStatus.yourData ||
        status.page === OnboardingStatus.privacy ||
        status.page === OnboardingStatus.agreement
      }
      goBack={goBack}
      activeSection={Math.round(status.page)}
      scrollViewRef={scrollViewRef}
      scrollableStyle={styles.scrollViewStyle}>
      <Animated.View
        style={[
          styles.animatedView,
          {transform: [{translateX: status.slideInX}]},
          {minHeight: Dimensions.get('window').height - 190}
        ]}>
        <Text
          ref={focusStart}
          style={styles.heading}
          maxFontSizeMultiplier={2.4}>
          {status.page !== OnboardingStatus.upgradeNotice
            ? t(`onboarding:${OnboardingStatus[status.page]}:view:title`)
            : t(`onboarding:${OnboardingStatus[status.page]}:${os}:title`)}
        </Text>
        <Spacing s={24} />
        {status.page === OnboardingStatus.whyUse && (
          <WhyUse handleNext={handleNext} />
        )}
        {status.page === OnboardingStatus.yourData && (
          <YourData handleNext={handleNext} />
        )}
        {status.page === OnboardingStatus.privacy && (
          <PrivacyInfo disabled={status.loading} handleNext={handleNext} />
        )}
        {status.page === OnboardingStatus.agreement && (
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
        <Spinner animation="fade" visible overlayColor={'rgba(0, 0, 0, 0.5)'} />
      )}
    </Layouts.OnboardingWithNavbar>
  );
};

const styles = StyleSheet.create({
  animatedView: {flex: 1},
  heading: {
    ...text.h1Heading,
    color: colors.primaryPurple
  },
  scrollViewStyle: {
    marginTop: 130,
    paddingTop: 20
  }
});
