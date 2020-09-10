import React, {FC, useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  Animated,
  Alert,
  findNodeHandle,
  AccessibilityInfo,
  StatusBar
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import Spacing from '../atoms/spacing';
import Button from '../atoms/button';
import {ScreenNames} from '../../navigation';
import {text, colors} from '../../theme';
import {useSettings} from '../../providers/settings';
import {useApplication} from '../../providers/context';
import {useConfirmationSpace} from '../../hooks/confirmation-space';

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
  const ref = useRef<any>();
  const [pressed, setPressed] = useState(false);
  const {accessibility} = useApplication();
  const {ageLimit} = useSettings();

  const {topTrim, contentHeight, ILLUSTRATION_HEIGHT} = useConfirmationSpace(
    CONTENT_HEIGHT
  );

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

  useEffect(() => {
    if (ref.current) {
      const tag = findNodeHandle(ref.current);
      if (tag) {
        setTimeout(() => AccessibilityInfo.setAccessibilityFocus(tag), 200);
      }
    }
  });

  const handleNo = () => {
    setPressed(true);
    Alert.alert(
      t('ageRequirement:underAlert:title', {ageLimit}),
      t('ageRequirement:underAlert:body', {ageLimit}),
      [
        {
          text: t('ageRequirement:underAlert:action'),
          style: 'default',
          onPress: () => {
            setPressed(false);
          }
        }
      ]
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View
        ref={ref}
        style={styles.background}
        accessible={true}
        accessibilityHint={t('viewNames:age')}
      />
      <View testID="welcome" style={[styles.container]}>
        <View style={styles.group}>
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
        </View>
        <Animated.View
          style={[
            styles.bottom,
            {
              minHeight: contentHeight,
              maxHeight: CONTENT_HEIGHT,
              transform: [{translateY: position}]
            }
          ]}>
          <View style={[styles.bottomContainer]}>
            <Image
              style={[styles.wave, {width, height: contentHeight}]}
              width={width}
              height={contentHeight}
              source={WaveBackground}
              accessibilityIgnoresInvertColors={false}
              resizeMode="stretch"
            />
            <ScrollView>
              <Spacing s={50} />
              <Text style={styles.notice}>
                {t('ageRequirement:notice', {ageLimit})}
              </Text>
              <Spacing s={38} />
              <Button
                disabled={pressed}
                type="primary"
                onPress={() => {
                  setPressed(true);
                  navigation.replace(ScreenNames.locationConfirmation);
                }}
                label={t('ageRequirement:accessibility:overLabel', {ageLimit})}>
                {t('ageRequirement:over', {ageLimit})}
              </Button>
              <Spacing s={24} />
              <Button
                disabled={pressed}
                type="link"
                onPress={handleNo}
                label={t('ageRequirement:accessibility:underLabel', {
                  ageLimit
                })}>
                {t('ageRequirement:under', {ageLimit})}
              </Button>
              <Spacing s={24} />
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 10
  },
  notice: {
    ...text.leader,
    textAlign: 'center'
  },
  bottom: {
    backgroundColor: colors.white
  },
  bottomContainer: {
    paddingHorizontal: 45
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: colors.primaryPurple,
    flex: 1,
    justifyContent: 'flex-end'
  },
  wave: {
    position: 'absolute',
    top: -40,
    left: 0,
    right: 0,
    height: 400
  },
  group: {
    flex: 1
  }
});
