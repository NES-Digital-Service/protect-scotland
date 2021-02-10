import React, {FC, useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import Container from '../atoms/container';
import Text from '../atoms/text';
import Spacing from '../atoms/spacing';
import Button from '../atoms/button';
import {Back} from '../atoms/back';
import {ScreenNames} from '../../navigation';
import {colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {useApplication} from '../../providers/context';
import {useConfirmationSpace} from '../../hooks/confirmation-space';
import {A11yView, useA11yElement} from '../../hooks/a11y-element';

const OnboardingLogo = require('../../assets/images/onboarding-logo/image.png');
const OnboardingGroup = require('../../assets/images/onboarding-group/image.png');
const WaveBackground = require('../../assets/images/wave/image.png');

interface LocationConfirmationProps {
  navigation: StackNavigationProp<any>;
}

const {width, height} = Dimensions.get('window');

// The minimum amount of space required to show the content
const MIN_CONTENT_HEIGHT = 300;
const MAX_CONTENT_HEIGHT = 550;

export const LocationConfirmation: FC<LocationConfirmationProps> = ({
  navigation
}) => {
  const {t} = useTranslation();
  const position = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);
  const {accessibility} = useApplication();
  const {a11yProps, focusA11yElement} = useA11yElement();

  const {
    topTrim,
    contentHeight,
    ILLUSTRATION_HEIGHT,
    LOGO_HEIGHT
  } = useConfirmationSpace(MIN_CONTENT_HEIGHT);

  useEffect(() => {
    Animated.stagger(accessibility.reduceMotionEnabled ? 0 : 200, [
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(position, {
        toValue: 0,
        duration: accessibility.reduceMotionEnabled ? 0 : 700,
        useNativeDriver: true
      })
    ]).start();
  });

  useEffect(() => focusA11yElement(200), [focusA11yElement]);

  let alertText = t('locationConfirmation:noAlert:body');
  let alertTitle = t('locationConfirmation:noAlert:title');

  // Android alert titles default to max two lines, cropping long text.
  // RN doesn't allow this to be changed - https://github.com/facebook/react-native/issues/10527
  if (Platform.OS === 'android') {
    alertText = `${alertTitle}

${alertText}`;
    alertTitle = '';
  }

  const handleNo = () => {
    setPressed(true);
    Alert.alert(alertTitle, alertText, [
      {
        text: t('locationConfirmation:noAlert:action'),
        style: 'default',
        onPress: () => {
          setPressed(false);
        }
      }
    ]);
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.background} />
      <A11yView {...a11yProps} accessibilityHint={t('viewNames:location')} />
      <View style={styles.back}>
        <Back onPress={() => navigation.popToTop()} />
      </View>
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
              maxHeight: MAX_CONTENT_HEIGHT,
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
            <ScrollView>
              <Spacing s={30} />
              <Text variant="leader" align="center">
                {t('locationConfirmation:notice')}
              </Text>
              <Spacing s={30} />
              <Text align="center">
                {t('locationConfirmation:description')}
              </Text>
              <Spacing s={30} />
              <Text variant="leader" align="center">
                {t('locationConfirmation:question')}
              </Text>
              <Spacing s={38} />
              <Button
                disabled={pressed}
                type="primary"
                onPress={() => {
                  setPressed(true);
                  navigation.navigate(ScreenNames.onboarding);
                  setPressed(false);
                }}
                hint={t('locationConfirmation:yesBtn')}>
                {t('common:yes:label')}
              </Button>
              <Spacing s={24} />
              <Button
                disabled={pressed}
                type="link"
                onPress={handleNo}
                hint={t('locationConfirmation:noBtn')}>
                {t('common:no:label')}
              </Button>
              <Spacing s={24} />
            </ScrollView>
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
    paddingHorizontal: SPACING_HORIZONTAL,
    paddingBottom: 30
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primaryPurple,
    flex: 1,
    justifyContent: 'flex-end'
  },
  back: {
    position: 'absolute',
    top: 40,
    left: 40,
    zIndex: 1
  },
  wave: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0
  }
});
