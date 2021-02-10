import React, {FC, MutableRefObject} from 'react';
import {ScrollView, ViewStyle} from 'react-native';

import Container from '../../components/atoms/container';
import NavBar from '../../components/molecules/onboarding-navbar';
import {Scrollable} from './scrollable';

interface OnboardingWithNavbarProps {
  goBack(): void;
  canGoBack: boolean;
  sections: number;
  activeSection: number;
  backgroundColor?: string;
  scrollableStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewRef?: MutableRefObject<ScrollView | null>;
}

const OnboardingWithNavbar: FC<OnboardingWithNavbarProps> = ({
  canGoBack,
  goBack,
  children,
  sections,
  activeSection,
  backgroundColor,
  contentContainerStyle,
  scrollableStyle,
  scrollViewRef
}) => (
  <Container style={[!!backgroundColor && {backgroundColor: backgroundColor}]}>
    <NavBar
      canGoBack={canGoBack}
      goBack={goBack}
      sections={sections}
      activeSection={activeSection}
    />
    <Scrollable
      scrollableStyle={scrollableStyle}
      scrollViewRef={scrollViewRef}
      importantForAccessibility="no"
      contentContainerStyle={contentContainerStyle}>
      {children}
    </Scrollable>
  </Container>
);

export default OnboardingWithNavbar;
