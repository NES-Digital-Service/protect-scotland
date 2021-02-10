import React, {FC, useRef, useEffect, useState} from 'react';
import {StyleSheet, Animated, ScrollView, StatusBar, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Spacing from '../atoms/spacing';
import Button from '../atoms/button';
import {ScreenNames} from '../../navigation';
import {useApplication, UserAgeGroup} from '../../providers/context';
import {useAgeGroupTranslation, useA11yElement} from '../../hooks';
import {colors} from '../../theme';
import Container from '../atoms/container';
import Text from '../atoms/text';
import {Back} from '../atoms/back';
import {SPACING_TOP, SPACING_BOTTOM} from '../../theme/layouts/shared';

const AgeGroup2Illustration = require('../../assets/images/age-sorting-age-group-2-illustration/image.png');
const AgeGroup3Illustration = require('../../assets/images/age-sorting-age-group-3-illustration/image.png');

interface AgeSortingProps {
  navigation: StackNavigationProp<any>;
}

export const AgeSorting: FC<AgeSortingProps> = ({navigation}) => {
  const {user} = useApplication();
  const opacity = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);
  const {getTranslation} = useAgeGroupTranslation();
  const insets = useSafeAreaInsets();
  const {focusRef, focusA11yElement} = useA11yElement();

  useEffect(() => focusA11yElement(200), [focusA11yElement]);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        ref={focusRef}
        accessibilityHint={getTranslation('viewNames:ageSorting')}
        testID="welcome"
        style={
          user?.ageGroup === UserAgeGroup.ageGroup2
            ? styles.ageGroup2
            : styles.ageGroup3
        }
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + SPACING_TOP,
            paddingBottom: insets.bottom + SPACING_BOTTOM
          }
        ]}>
        <Spacing s={30} />
        <View style={[styles.back, {top: insets.top + SPACING_TOP}]}>
          <Back />
        </View>
        <Container center="horizontal" stretch={false}>
          <Animated.Image
            style={{
              opacity
            }}
            source={
              user?.ageGroup === UserAgeGroup.ageGroup2
                ? AgeGroup2Illustration
                : AgeGroup3Illustration
            }
            accessibilityIgnoresInvertColors={false}
            resizeMode="center"
          />
        </Container>
        <Container>
          <Spacing s={55} />
          <Text variant="leader" align="center">
            {getTranslation('ageSorting:notice')}
          </Text>
          <Spacing s={25} />
          <Text align="center">{getTranslation('ageSorting:description')}</Text>
          <Spacing s={38} />
        </Container>
        <Button
          disabled={pressed}
          buttonStyle={
            user?.ageGroup === UserAgeGroup.ageGroup2
              ? styles.btnAgeGroup2
              : styles.btnAgeGroup3
          }
          onPress={() => {
            setPressed(true);
            navigation.push(ScreenNames.locationConfirmation);
            setPressed(false);
          }}
          label={getTranslation('ageSorting:nextLabel')}>
          {getTranslation('ageSorting:nextLabel')}
        </Button>
        <Spacing s={24} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 45
  },
  back: {
    position: 'absolute',
    left: 40
  },
  ageGroup2: {
    backgroundColor: colors.lighterPurple
  },
  ageGroup3: {
    backgroundColor: colors.errorRedTint
  },
  btnAgeGroup2: {
    backgroundColor: colors.primaryPurple
  },
  btnAgeGroup3: {
    backgroundColor: colors.errorRed
  }
});
