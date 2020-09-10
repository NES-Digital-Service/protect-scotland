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
import {useApplication} from '../../providers/context';
import {useConfirmationSpace} from '../../hooks/confirmation-space';

const OnboardingGroup = require('../../assets/images/onboarding-group/image.png');
const WaveInvertedBackground = require('../../assets/images/wave-inverted/image.png');

interface LocationConfirmationProps {
  navigation: StackNavigationProp<any>;
}

const {width, height} = Dimensions.get('window');

// The minimum amount of space required to show the content
const MIN_CONTENT_HEIGHT = 480;
const MAX_CONTENT_HEIGHT = 550;

export const LocationConfirmation: FC<LocationConfirmationProps> = ({
  navigation
}) => {
  const {t} = useTranslation();
  const position = useRef(new Animated.Value(height + 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ref = useRef<any>();
  const [pressed, setPressed] = useState(false);
  const {accessibility} = useApplication();

  const {topTrim, contentHeight, ILLUSTRATION_HEIGHT} = useConfirmationSpace(
    MIN_CONTENT_HEIGHT
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
      t('locationConfirmation:noAlert:title'),
      t('locationConfirmation:noAlert:body'),
      [
        {
          text: t('locationConfirmation:noAlert:action'),
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
        accessibilityHint={t('viewNames:location')}
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
              maxHeight: MAX_CONTENT_HEIGHT,
              transform: [{translateY: position}]
            }
          ]}>
          <View style={styles.bottomContainer}>
            <Image
              style={[styles.wave, {width, height: contentHeight}]}
              width={width}
              height={contentHeight}
              source={WaveInvertedBackground}
              accessibilityIgnoresInvertColors={false}
              resizeMode="stretch"
            />
            <ScrollView>
              <Spacing s={30} />
              <Text style={styles.notice}>
                {t('locationConfirmation:notice')}
              </Text>
              <Spacing s={30} />
              <Text style={styles.viewText}>
                {t('locationConfirmation:description')}
              </Text>
              <Spacing s={30} />
              <Text style={styles.notice}>
                {t('locationConfirmation:question')}
              </Text>
              <Spacing s={38} />
              <Button
                disabled={pressed}
                type="primary"
                onPress={() => {
                  setPressed(true);
                  navigation.replace(ScreenNames.onboarding);
                }}
                hint={t('locationConfirmation:yesBtn')}
                label={t('common:yes:label')}>
                {t('common:yes:label')}
              </Button>
              <Spacing s={24} />
              <Button
                disabled={pressed}
                type="link"
                onPress={handleNo}
                hint={t('locationConfirmation:noBtn')}
                label={t('common:no:label')}>
                {t('common:no:label')}
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
  contentContainer: {
    flexGrow: 1
  },
  notice: {
    ...text.leader,
    textAlign: 'center'
  },
  viewText: {
    ...text.paragraph,
    textAlign: 'center'
  },
  bottom: {
    backgroundColor: colors.white
  },
  bottomContainer: {
    paddingHorizontal: 45,
    paddingBottom: 30
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
