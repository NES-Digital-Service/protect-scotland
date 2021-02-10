import React, {FC, MutableRefObject, useEffect} from 'react';
import {Platform} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef
} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators
} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {PushNotification as PN} from 'react-native-push-notification';

import {colors} from '../../theme';
import {isMountedRef, navigationRef, ScreenNames} from '../../navigation';
import {useApplication, User} from '../../providers/context';
import {Onboarding} from '../views/onboarding';
import {AgeConfirmation} from '../views/age-confirmation';
import {LocationConfirmation} from '../views/location-confirmation';
import {Dashboard} from '../views/dashboard';
import {Community} from '../views/community';
import {TestsAdd} from '../views/tests-add';
import {Tracing} from '../views/tracing';
import {About} from '../views/about';
import {Settings} from '../views/settings';
import {CloseContact} from '../views/close-contact';
import {TestsResult} from '../views/tests-result';
import {Terms} from '../views/terms';
import {Leave} from '../views/leave';
import {Tests} from '../views/tests';
import {DataPolicy} from '../views/data-policy';
import {Debug} from '../views/debug';
import {ScotlandState} from '../../App';
import {Pause} from '../views/pause';
import {AgeUnder} from '../views/age-under';
import {YourDataModal} from '../views/onboarding/your-data-modal';
import {TestResultModal} from '../views/onboarding/test-result-modal';
import {AgeSorting} from '../views/age-sorting';
import {notificationHooks} from '../../services/notifications';
import {GetTranslation, useAgeGroupTranslation} from '../../hooks';
import {CalculatorModal} from '../views/calculator';
import {SendNotice} from '../views/sendNotice';

const Stack = createStackNavigator();

const Screens = (t: TFunction, getTranslation: GetTranslation) => {
  const noHeader = {
    header: () => null,
    headerShown: false
  };

  return [
    {
      name: ScreenNames.ageConfirmation,
      component: AgeConfirmation,
      options: {
        title: t('viewNames:age'),
        ...noHeader,
        cardStyle: {
          backgroundColor: colors.primaryPurple
        }
      }
    },
    {
      name: ScreenNames.ageUnder,
      component: AgeUnder,
      options: {
        title: t('viewNames:ageUnder'),
        ...noHeader,
        cardStyle: {
          backgroundColor: colors.primaryPurple
        }
      }
    },
    {
      name: ScreenNames.ageSorting,
      component: AgeSorting,
      options: {
        title: getTranslation('viewNames:ageSorting'),
        ...noHeader
      }
    },
    {
      name: ScreenNames.locationConfirmation,
      component: LocationConfirmation,
      options: {
        title: t('viewNames:location'),
        ...noHeader,
        cardStyle: {
          backgroundColor: colors.primaryPurple
        }
      }
    },
    {
      name: ScreenNames.onboarding,
      component: Onboarding,
      options: {
        title: t('viewNames:onboarding'),
        ...noHeader,
        cardStyle: {}
      }
    },
    {
      name: ScreenNames.askPermissions,
      component: Onboarding,
      options: {
        title: t('viewNames:onboarding'),
        ...noHeader,
        cardStyle: {}
      }
    },
    {
      name: ScreenNames.dashboard,
      component: Dashboard,
      options: {
        ...noHeader,
        cardStyle: {backgroundColor: colors.white}
      }
    },
    {
      name: ScreenNames.tracing,
      component: Tracing,
      options: {
        ...noHeader,
        title: t('viewNames:tracing'),
        cardStyle: {backgroundColor: colors.greenBackground},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.about,
      component: About,
      options: {
        ...noHeader,
        title: t('viewNames:about'),
        cardStyle: {backgroundColor: colors.notificationYellowTint},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.community,
      component: Community,
      options: {
        ...noHeader,
        title: t('viewNames:community'),
        cardStyle: {backgroundColor: colors.lilac},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.tests,
      component: Tests,
      options: {
        ...noHeader,
        title: t('viewNames:tests'),
        cardStyle: {backgroundColor: colors.backgroundYellow},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.testsAdd,
      component: TestsAdd,
      options: {
        ...noHeader,
        title: t('viewNames:testsAdd'),
        cardStyle: {backgroundColor: colors.backgroundYellow},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.testsResult,
      component: TestsResult,
      options: {
        ...noHeader,
        title: t('viewNames:testsResult'),
        cardStyle: {backgroundColor: colors.backgroundYellow},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.settings,
      component: Settings,
      options: {
        ...noHeader,
        title: t('viewNames:settings'),
        cardStyle: {backgroundColor: colors.darkPurple},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.closeContact,
      component: CloseContact,
      options: {
        ...noHeader,
        title: t('viewNames:closeContact'),
        cardStyle: {backgroundColor: colors.errorRedTint},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.terms,
      component: Terms,
      options: {
        title: t('viewNames:terms'),
        ...noHeader,
        cardStyle: {backgroundColor: colors.white},
        cardStyleInterpolator:
          Platform.OS === 'ios'
            ? CardStyleInterpolators.forHorizontalIOS
            : CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: Platform.OS === 'ios' ? 'horizontal' : 'vertical'
      }
    },
    {
      name: ScreenNames.dataPolicy,
      component: DataPolicy,
      options: {
        title: t('viewNames:dataPolicy'),
        ...noHeader,
        cardStyle: {backgroundColor: colors.white}
      }
    },
    {
      name: ScreenNames.leave,
      component: Leave,
      options: {
        title: t('viewNames:leave'),
        ...noHeader,
        cardStyle: {backgroundColor: colors.white}
      }
    },
    {
      name: ScreenNames.debug,
      component: Debug,
      options: {
        title: t('viewNames:debug'),
        ...noHeader,
        cardStyle: {backgroundColor: colors.white}
      }
    },
    {
      name: ScreenNames.pause,
      component: Pause,
      options: {
        title: t('viewNames:pause'),
        ...noHeader,
        cardStyle: {},
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.yourDataModal,
      component: YourDataModal,
      options: {
        title: t('viewNames:yourDataModal'),
        ...noHeader,
        cardStyle: {backgroundColor: colors.transparent},
        cardStyleInterpolator:
          Platform.OS === 'ios'
            ? CardStyleInterpolators.forVerticalIOS
            : CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.testResultModal,
      component: TestResultModal,
      options: {
        title: t('viewNames:testResultModal'),
        ...noHeader,
        cardStyle: {backgroundColor: colors.transparent},
        cardStyleInterpolator:
          Platform.OS === 'ios'
            ? CardStyleInterpolators.forVerticalIOS
            : CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.calculatorModal,
      component: CalculatorModal,
      options: {
        ...noHeader,
        title: t('viewNames:calculatorModal'),
        cardStyle: {backgroundColor: colors.backgroundYellow},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    },
    {
      name: ScreenNames.sendNotice,
      component: SendNotice,
      options: {
        ...noHeader,
        title: t('viewNames:sendNotice'),
        cardStyle: {backgroundColor: colors.backgroundYellow},
        cardStyleInterpolator:
          CardStyleInterpolators.forRevealFromBottomAndroid,
        gestureEnabled: true,
        gestureDirection: 'vertical'
      }
    }
  ];
};

interface Navigation {
  notification: PN | null;
  exposureNotificationClicked: boolean | null;
  completedExposureOnboarding: boolean | null;
  setState: (value: React.SetStateAction<ScotlandState>) => void;
}

const Navigation: FC<Navigation> = ({
  notification,
  exposureNotificationClicked,
  completedExposureOnboarding,
  setState
}) => {
  const {t} = useTranslation();
  const {accessibility} = useApplication();
  const {getTranslation} = useAgeGroupTranslation();
  const app = useApplication();

  useEffect(() => {
    (isMountedRef as MutableRefObject<boolean>).current = true;
    return () => {
      (isMountedRef as MutableRefObject<boolean>).current = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    if (navigationRef.current && notification) {
      navigationRef.current.navigate(ScreenNames.closeContact);

      setState((s) => ({...s, notification: null}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    if (navigationRef.current && exposureNotificationClicked) {
      navigationRef.current.navigate(ScreenNames.closeContact);
      setState((s) => ({...s, exposureNotificationClicked: null}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exposureNotificationClicked]);

  const initialScreen =
    app.user && completedExposureOnboarding
      ? ScreenNames.dashboard
      : ScreenNames.ageConfirmation;

  return (
    <NavigationContainer
      ref={(e) => {
        notificationHooks.navigation = e as NavigationContainerRef;
        (navigationRef as MutableRefObject<NavigationContainerRef | null>).current = e;
      }}>
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {backgroundColor: 'transparent'},
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animationEnabled: !accessibility.reduceMotionEnabled
        }}
        initialRouteName={initialScreen}
        headerMode="float"
        mode="modal">
        {Screens(t, getTranslation).map((screen, index) => (
          // @ts-ignore
          <Stack.Screen {...screen} key={`screen-${index}`} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
