import React, {FC, MutableRefObject} from 'react';
import {ScrollView, StyleSheet, View, ViewStyle} from 'react-native';
import NavBar from '../../components/molecules/onboarding-navbar';
import {Scrollable} from './scrollable';
import {colors} from '../../theme';

const ONBOARDING_STEPS = 5;

interface OnboardingWithNavbarProps {
  goBack(): void;
  canGoBack: boolean;
  activeSection: number;
  scrollableStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewRef?: MutableRefObject<ScrollView | null>;
}

const OnboardingWithNavbar: FC<OnboardingWithNavbarProps> = ({
  canGoBack,
  goBack,
  children,
  activeSection,
  contentContainerStyle,
  scrollableStyle,
  scrollViewRef
}) => (
  <View style={[styles.container]}>
    <NavBar
      canGoBack={canGoBack}
      goBack={goBack}
      sections={ONBOARDING_STEPS}
      activeSection={activeSection}
    />
    <Scrollable
      scrollableStyle={scrollableStyle}
      scrollViewRef={scrollViewRef}
      backgroundColor={colors.white}
      contentContainerStyle={contentContainerStyle}>
      {children}
    </Scrollable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default OnboardingWithNavbar;
