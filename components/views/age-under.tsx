import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  View,
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
import {A11yView, useA11yElement, useConfirmationSpace} from '../../hooks';

const OnboardingLogo = require('../../assets/images/onboarding-logo/image.png');
const OnboardingGroup = require('../../assets/images/onboarding-group/image.png');
const WaveBackground = require('../../assets/images/wave/image.png');

interface AgeUnderProps {
  navigation: StackNavigationProp<any>;
}

const {width, height} = Dimensions.get('window');

// The minimum amount of space required to show the content without scrolling with a standard font size
const CONTENT_HEIGHT = 300;

export const AgeUnder: FC<AgeUnderProps> = ({navigation}) => {
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

  let alertText = t('ageRequirement:underAlert:body');
  let alertTitle = t('ageRequirement:underAlert:title');

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
        text: t('ageRequirement:underAlert:action'),
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
      <A11yView {...a11yProps} accessibilityHint={t('viewNames:ageUnder')} />
      <View style={styles.back}>
        <Back />
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
            <Text align="center">{t('ageUnder:notice')}</Text>
            <Spacing s={30} />
            <Text variant="leader" align="center">
              {t('ageUnder:question')}
            </Text>
            <Spacing s={46} />
            <Button
              disabled={pressed}
              type="primary"
              onPress={() => navigation.push(ScreenNames.ageSorting)}
              hint={t('common:yes:hint')}
              label={t('common:yes:label')}>
              {t('common:yes:label')}
            </Button>
            <Spacing s={32} />
            <Button
              disabled={pressed}
              type="link"
              onPress={handleNo}
              hint={t('common:no:hint')}
              label={t('common:no:label')}>
              {t('common:no:label')}
            </Button>
            <Spacing s={30} />
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
  back: {
    position: 'absolute',
    top: 40,
    left: 40,
    zIndex: 1
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
