import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import Container from '../atoms/container';
import Text from '../atoms/text';
import Spacing from '../atoms/spacing';
import Button from '../atoms/button';
import {ScreenNames} from '../../navigation';
import {colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {useApplication, UserAgeGroup} from '../../providers/context';
import {useConfirmationSpace, A11yView, useA11yElement} from '../../hooks';

const OnboardingLogo = require('../../assets/images/onboarding-logo/image.png');
const OnboardingGroup = require('../../assets/images/onboarding-group/image.png');
const WaveBackground = require('../../assets/images/wave/image.png');

interface AgeConfirmationProps {
  navigation: StackNavigationProp<any>;
}

const {width, height} = Dimensions.get('window');

// The minimum amount of space required to show the content without scrolling with a standard font size
const CONTENT_HEIGHT = 300;

export const AgeConfirmation: FC<AgeConfirmationProps> = ({navigation}) => {
  const {t} = useTranslation();
  const position = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const {accessibility, setContext} = useApplication();
  const {a11yProps, focusA11yElement} = useA11yElement();
  const [pressed, setPressed] = useState(false);

  const {
    topTrim,
    contentHeight,
    ILLUSTRATION_HEIGHT,
    LOGO_HEIGHT
  } = useConfirmationSpace(CONTENT_HEIGHT);

  useEffect(() => {
    Animated.stagger(accessibility.reduceMotionEnabled ? 0 : 200, [
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(position, {
        toValue: 2,
        duration: accessibility.reduceMotionEnabled ? 0 : 700,
        useNativeDriver: true
      })
    ]).start();
  });

  useEffect(() => focusA11yElement(200), [focusA11yElement]);

  const handleAgeGroupClick = async (
    ageGroup: UserAgeGroup,
    screen: ScreenNames
  ) => {
    const saveAgeGroupAndContinue = async () => {
      await setContext({
        user: {
          ageGroup
        }
      });

      navigation.push(screen);
      setPressed(false);
    };

    setPressed(true);

    if (ageGroup !== UserAgeGroup.ageGroup3) {
      return Alert.alert(t('ageRequirement:alert:title'), undefined, [
        {
          text: t('ageRequirement:alert:buttonCancel'),
          onPress: () => setPressed(false)
        },
        {
          text: t(`ageRequirement:alert:buttonNext:${ageGroup}`),
          onPress: saveAgeGroupAndContinue
        }
      ]);
    }

    return saveAgeGroupAndContinue();
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.background} />
      <A11yView {...a11yProps} accessibilityHint={t('viewNames:age')} />
      <Container testID="welcome">
        <Container>
          <Animated.Image
            style={{
              opacity,
              top: topTrim
            }}
            width={width}
            height={LOGO_HEIGHT}
            source={OnboardingLogo}
            accessible
            accessibilityHint={t('logo:main')}
            accessibilityIgnoresInvertColors={false}
          />
          <Animated.Image
            style={{
              opacity,
              top: topTrim
            }}
            width={width}
            height={ILLUSTRATION_HEIGHT}
            source={OnboardingGroup}
            accessibilityIgnoresInvertColors={false}
          />
        </Container>
        <Animated.View
          style={[
            styles.bottom,
            {
              minHeight: contentHeight,
              transform: [{translateY: position}]
            }
          ]}>
          <View style={styles.bottomContainer}>
            <Image
              style={[styles.wave, {width, height: contentHeight}]}
              width={width}
              height={contentHeight}
              source={WaveBackground}
              accessibilityIgnoresInvertColors={false}
              resizeMode="stretch"
            />
            <Spacing s={30} />
            <Text variant="leader" align="center">
              {t('ageRequirement:notice')}
            </Text>
            <Spacing s={30} />
            <Button
              type="tertiary"
              disabled={pressed}
              variant="small"
              onPress={() =>
                handleAgeGroupClick(
                  UserAgeGroup.ageGroup1,
                  ScreenNames.locationConfirmation
                )
              }
              hint={t('ageRequirement:button:ageGroup1:hint')}
              label={t('ageRequirement:button:ageGroup1:label')}>
              {t('ageRequirement:button:ageGroup1:label')}
            </Button>
            <Spacing s={15} />
            <Button
              type="tertiary"
              disabled={pressed}
              variant="small"
              onPress={() =>
                handleAgeGroupClick(
                  UserAgeGroup.ageGroup2,
                  ScreenNames.ageSorting
                )
              }
              hint={t('ageRequirement:button:ageGroup2:hint')}
              label={t('ageRequirement:button:ageGroup2:label')}>
              {t('ageRequirement:button:ageGroup2:label')}
            </Button>
            <Spacing s={15} />
            <Button
              type="tertiary"
              disabled={pressed}
              variant="small"
              onPress={() =>
                handleAgeGroupClick(
                  UserAgeGroup.ageGroup3,
                  ScreenNames.ageUnder
                )
              }
              hint={t('ageRequirement:button:under:hint')}
              label={t('ageRequirement:button:under:label')}>
              {t('ageRequirement:button:under:label')}
            </Button>
            <Spacing s={15} />
          </View>
        </Animated.View>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: colors.white
  },
  bottomContainer: {
    paddingHorizontal: SPACING_HORIZONTAL
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryPurple,
    flex: 1,
    justifyContent: 'flex-end'
  },
  wave: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0
  }
});
