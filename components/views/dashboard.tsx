import React, {FC, useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Animated,
  RefreshControl,
  ActivityIndicator,
  Platform
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  useNavigation,
  useFocusEffect,
  useIsFocused
} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  useExposure,
  StatusState,
  StatusType,
  Status
} from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';
import {differenceInCalendarDays} from 'date-fns';

import Container from '../atoms/container';
import Text from '../atoms/text';
import {text, colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {Header} from '../molecules/header';
import {Grid} from '../molecules/grid';
import {Message} from '../atoms/message';
import Spacing from '../atoms/spacing';
import Markdown from '../atoms/markdown';
import {ScreenNames} from '../../navigation';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useApplication} from '../../providers/context';
import {ArrowLink} from '../molecules/arrow-link';
import {
  ExposureNotificationsModal,
  BluetoothNotificationsModal,
  PushNotificationsModal
} from '../organisms/modals';
import {useSettings} from '../../providers/settings';
import {useAppState, useVersion, useA11yElement, A11yView} from '../../hooks';
import {useReminder} from '../../providers/reminder';
import {NewVersionCard} from '../molecules/new-version-card';
import {getExposureDate} from '../../utils/exposure';

const RestrictionsImage = require('../../assets/images/restrictions/image.png');

const ANIMATION_DURATION = 300;
const PROMPT_OFFSET = 1000;

const getMessage = ({
  onboarded,
  enabled,
  status,
  messages,
  stage,
  paused
}: {
  onboarded: boolean;
  enabled: boolean;
  status: Status;
  messages: string[];
  stage: number;
  paused?: string | null;
}): string => {
  if (paused) {
    return 'dashboard:message:paused';
  }
  if (onboarded) {
    if (enabled && status.state === StatusState.active) {
      return 'dashboard:message:standard';
    }
    return 'dashboard:message:inactive';
  } else {
    if (stage < 1) {
      if (enabled && status.state === StatusState.active) {
        return messages[0];
      }
      return 'dashboard:alternateTourStart';
    } else {
      return messages[stage];
    }
  }
};

export const Dashboard: FC = () => {
  const {t} = useTranslation();
  const {
    initialised,
    enabled,
    status,
    contacts,
    getCloseContacts,
    permissions,
    readPermissions
  } = useExposure();
  const [appState] = useAppState();
  const {checked, paused} = useReminder();
  const navigation = useNavigation();
  const {onboarded, setContext, loadAppData} = useApplication();
  const {
    isolationDuration,
    isolationCompleteDuration,
    latestVersion: appLatestVersion
  } = useSettings();
  const [refreshing, setRefreshing] = useState(false);
  const {
    focusRef: tourFocus,
    focusA11yElement: focusTourElem
  } = useA11yElement();
  const {
    focusRef: dashboardFocus,
    focusA11yElement: focusDashboardElem
  } = useA11yElement();
  const isFocused = useIsFocused();
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const gridOpacity = useRef(new Animated.Value(0)).current;
  const exposureEnabled = useRef(enabled);
  const bluetoothDisabled = useRef(
    status.state === 'disabled' && status.type?.includes(StatusType.bluetooth)
  );
  const pushNotificationsDisabled = useRef(
    permissions.notifications.status === 'not_allowed'
  );

  const [state, setState] = useState<{
    stage: number;
    exposurePrompt: boolean;
    bluetoothPrompt: boolean;
    pushNotificationsPrompt: boolean;
    disabled: boolean;
    current: string;
    isolationMessage: string | null;
    isolationComplete: boolean;
    default: string;
    messages: string[];
  }>({
    stage: onboarded ? -1 : 0,
    exposurePrompt: false,
    bluetoothPrompt: false,
    pushNotificationsPrompt: false,
    disabled: false,
    current: t(
      getMessage({
        onboarded,
        enabled,
        status,
        messages: t('dashboard:tour', {returnObjects: true}),
        stage: onboarded ? -1 : 0,
        paused
      })
    ),
    isolationMessage: null,
    isolationComplete: false,
    messages: t('dashboard:tour', {returnObjects: true}),
    default: t('dashboard:message:standard')
  });

  const version = useVersion();

  const resetToNormal = () =>
    setState((s) => ({
      ...s,
      isolationComplete: false,
      isolationMessage: null
    }));

  const setExposed = () =>
    setState((s) => ({
      ...s,
      isolationComplete: false,
      isolationMessage: t('dashboard:exposed')
    }));

  const setIsolationComplete = () =>
    setState((s) => ({
      ...s,
      isolationComplete: true,
      isolationMessage: t('dashboard:isolationComplete')
    }));

  const processContactsForMessaging = async () => {
    let currentStatus = null;
    try {
      currentStatus = await SecureStore.getItemAsync('niexposuredate');
    } catch (err) {
      await SecureStore.deleteItemAsync('niexposuredate');
      console.log('processContactsForMessaging', err);
    }

    if (currentStatus) {
      const daysDiff = differenceInCalendarDays(
        new Date(),
        new Date(Number(currentStatus))
      );

      const withIsolation = isolationDuration + isolationCompleteDuration;

      if (daysDiff >= withIsolation) {
        await SecureStore.deleteItemAsync('niexposuredate');
        return resetToNormal();
      }

      if (daysDiff >= isolationDuration && daysDiff < withIsolation) {
        return setIsolationComplete();
      }

      if (contacts && contacts.length > 0) {
        return setExposed();
      }
    }

    return resetToNormal();
  };

  const checkLatestExposure = async () => {
    const latestExposure = getExposureDate(contacts);

    if (latestExposure) {
      await SecureStore.setItemAsync(
        'niexposuredate',
        String(latestExposure.getTime())
      );
    }

    processContactsForMessaging();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAppData().then(() => setRefreshing(false));
  };

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCloseContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    checkLatestExposure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, status]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isFocused || appState !== 'active') {
        return;
      }

      readPermissions();
    }, [isFocused, appState, readPermissions])
  );

  useEffect(() => {
    setState((s) => ({
      ...s,
      current: t(
        getMessage({
          onboarded,
          enabled,
          status,
          messages: state.messages,
          stage: state.stage,
          paused
        })
      )
    }));

    exposureEnabled.current = enabled;
    bluetoothDisabled.current =
      status.state === 'disabled' &&
      status.type?.includes(StatusType.bluetooth);
    pushNotificationsDisabled.current =
      permissions.notifications.status === 'not_allowed';

    if (!exposureEnabled.current && onboarded) {
      setTimeout(() => {
        if (!exposureEnabled.current) {
          setState((s) => ({
            ...s,
            exposurePrompt: true
          }));
        }
      }, PROMPT_OFFSET);
    } else if (bluetoothDisabled.current && onboarded) {
      setTimeout(() => {
        if (bluetoothDisabled.current) {
          setState((s) => ({
            ...s,
            bluetoothPrompt: true
          }));
        }
      }, PROMPT_OFFSET);
    } else if (pushNotificationsDisabled.current && onboarded) {
      setTimeout(() => {
        if (
          pushNotificationsDisabled.current &&
          exposureEnabled.current &&
          !bluetoothDisabled.current
        ) {
          setState((s) => ({
            ...s,
            pushNotificationsPrompt: true
          }));
        }
      }, PROMPT_OFFSET);
    } else if (onboarded && exposureEnabled.current) {
      setState((s) => ({
        ...s,
        exposurePrompt: false
      }));
    }

    setTimeout(() => checkLatestExposure(), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, onboarded, status, permissions]);

  const animateTourIn = () => {
    setState((s) => ({...s, disabled: true}));
    Animated.parallel([
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(gridOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      })
    ]).start(() => {
      setState((s) => ({...s, disabled: false}));
    });
  };

  const animateTourOut = () => {
    setState((s) => ({...s, disabled: true}));
    Animated.parallel([
      Animated.timing(messageOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(gridOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      })
    ]).start(() => {
      if (state.stage < state.messages.length - 1) {
        setState((s) => ({
          ...s,
          stage: state.stage + 1,
          current: getMessage({
            onboarded,
            enabled,
            status,
            messages: state.messages,
            stage: state.stage + 1
          })
        }));
        animateTourIn();
      } else {
        setState((s) => ({
          ...s,
          stage: -1,
          current: s.default
        }));
        setContext({onboarded: true});
        animateDashboard();
      }
    });
  };

  const animateDashboard = () => {
    setState((s) => ({...s, disabled: true}));
    Animated.parallel([
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(gridOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      })
    ]).start(() => {
      AsyncStorage.setItem('scot.onboarded', 'true');
      setState((s) => ({...s, disabled: false}));
    });
  };

  useEffect(() => {
    if (onboarded) {
      setTimeout(() => animateDashboard(), 200);
    } else {
      setTimeout(() => animateTourIn(), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.disabled) {
      focusTourElem();
    }
  }, [focusTourElem, state.disabled]);

  useEffect(() => {
    if (onboarded && !state.disabled) {
      focusDashboardElem();
    }
  }, [focusDashboardElem, onboarded, state.disabled]);

  const handleTour = () => {
    animateTourOut();
  };

  if (!initialised || !checked) {
    return (
      <>
        <Container center="both">
          <ActivityIndicator color={colors.darkGrey} size="large" />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={onboarded && refreshing}
            onRefresh={onRefresh}
          />
        }>
        {onboarded &&
          appLatestVersion &&
          version &&
          appLatestVersion !== version?.display && (
            <View style={blockStyles.block}>
              <NewVersionCard />
              <Spacing s={16} />
            </View>
          )}
        <Spacing s={onboarded ? 15 : 65} />
        {!onboarded && state.stage > -1 && (
          <>
            <View style={styles.dots}>
              {[-1, 0, 1, 2].map((x) => (
                <Animated.View
                  key={`step-${x}`}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        state.stage > x
                          ? colors.primaryPurple
                          : colors.lighterPurple
                    }
                  ]}
                />
              ))}
            </View>
            <A11yView
              ref={tourFocus}
              accessible
              accessibilityHint={
                t('dashboard:tourA11y', {returnObjects: true})[state.stage]
              }
            />
            <Animated.View style={{opacity: messageOpacity}}>
              <TouchableWithoutFeedback onPress={() => handleTour()}>
                <Markdown markdownStyles={markDownStyles}>
                  {state.current}
                </Markdown>
              </TouchableWithoutFeedback>
              <Spacing s={30} />
              <ArrowLink
                onPress={() => {
                  if (!state.disabled) {
                    handleTour();
                  }
                }}
                accessibilityHint={t('dashboard:tourActionHint')}
                invert>
                <Text variant="h3" color="pink" style={styles.nextLink}>
                  {t('dashboard:tourAction')}
                </Text>
              </ArrowLink>
            </Animated.View>
          </>
        )}

        {onboarded && state.isolationMessage && (
          <>
            <Animated.View
              style={{
                opacity: messageOpacity
              }}>
              <View accessible ref={dashboardFocus}>
                <Markdown
                  markdownStyles={
                    state.isolationComplete
                      ? markDownStyles
                      : markDownStylesExposed
                  }>
                  {state.isolationMessage}
                </Markdown>
              </View>
              {!state.isolationComplete && (
                <>
                  <Spacing s={30} />
                  <ArrowLink
                    onPress={() =>
                      navigation.navigate(ScreenNames.closeContact)
                    }
                    accessibilityHint={t('dashboard:exposedAction')}
                    invert>
                    <Text variant="h3" color="pink" style={styles.nextLink}>
                      {t('dashboard:tourAction')}
                    </Text>
                  </ArrowLink>
                </>
              )}
              {state.isolationComplete && (
                <>
                  <Spacing s={20} />
                  <Text style={blockStyles.block} inline color="darkGrey">
                    {t('dashboard:isolationCompleteSupplemental')}
                  </Text>
                </>
              )}
            </Animated.View>
            <Spacing s={30} />
            <Animated.View
              style={[{opacity: contentOpacity}, blockStyles.block]}>
              <Message />
            </Animated.View>
          </>
        )}

        {onboarded && !state.isolationMessage && (
          <Animated.View style={{opacity: messageOpacity}}>
            <View accessible ref={dashboardFocus}>
              <Markdown markdownStyles={markDownStyles}>
                {state.current}
              </Markdown>
            </View>
            {state.stage === -1 && !paused && (
              <>
                <Spacing s={20} />
                <Text style={blockStyles.block} inline color="darkGrey">
                  {t(`dashboard:message:bluetooth:${Platform.OS}`)}
                </Text>
              </>
            )}
            {state.stage === -1 && paused && (
              <>
                <Spacing s={20} />
                <Text style={blockStyles.block} inline color="darkGrey">
                  {t('dashboard:message:pausedSupplemental')}
                </Text>
              </>
            )}
          </Animated.View>
        )}
        <Spacing s={30} />
        <Grid
          onboarded={onboarded}
          stage={state.stage}
          opacity={gridOpacity}
          onboardingCallback={() => handleTour()}
        />
        {state.isolationMessage && <Spacing s={34} />}
        {onboarded && !state.isolationMessage && (
          <>
            <Animated.View
              style={[{opacity: contentOpacity}, blockStyles.block]}>
              <Spacing s={30} />
              <Message />
              <Spacing s={16} />
              <Message
                image={RestrictionsImage}
                markdown={t('restrictions:message')}
                accessibilityLabel={t('restrictions:a11y:label')}
                accessibilityHint={t('restrictions:a11y:hint')}
                link={t('links:r')}
              />
              <Spacing s={45} />
            </Animated.View>
          </>
        )}
        {onboarded && (
          <Text variant="h4" color="primaryPurple" align="center">
            {t('dashboard:thanks')}
          </Text>
        )}
        <Spacing s={60} />
      </ScrollView>
      {checked && !paused && state.exposurePrompt && (
        <ExposureNotificationsModal
          isVisible={state.exposurePrompt}
          onBackdropPress={() =>
            setState((s) => ({...s, exposurePrompt: false}))
          }
          onClose={() => setState((s) => ({...s, exposurePrompt: false}))}
        />
      )}
      {checked && !paused && state.bluetoothPrompt && (
        <BluetoothNotificationsModal
          isVisible={state.bluetoothPrompt}
          onBackdropPress={() =>
            setState((s) => ({...s, bluetoothPrompt: false}))
          }
          onClose={() => setState((s) => ({...s, bluetoothPrompt: false}))}
        />
      )}
      {checked && !paused && state.pushNotificationsPrompt && (
        <PushNotificationsModal
          isVisible={state.pushNotificationsPrompt}
          onBackdropPress={() =>
            setState((s) => ({...s, pushNotificationsPrompt: false}))
          }
          onClose={() =>
            setState((s) => ({...s, pushNotificationsPrompt: false}))
          }
        />
      )}
    </>
  );
};

const blockStyles = StyleSheet.create({
  block: {
    marginHorizontal: SPACING_HORIZONTAL
  }
});

const markDownStyles = StyleSheet.create({
  ...blockStyles,
  text: {
    ...text.h1Heading,
    ...blockStyles.block,
    color: colors.primaryPurple
  }
});

const markDownStylesExposed = StyleSheet.create({
  ...markDownStyles,
  text: {
    ...markDownStyles.text,
    color: colors.errorRed
  }
});

const styles = StyleSheet.create({
  nextLink: {
    paddingLeft: SPACING_HORIZONTAL,
    paddingRight: 5
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 30,
    paddingLeft: 46,
    paddingRight: SPACING_HORIZONTAL
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: colors.primaryPurple,
    marginRight: 10
  }
});
