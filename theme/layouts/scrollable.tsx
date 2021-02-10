import React, {FC, MutableRefObject} from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  ViewStyle,
  AccessibilityProps
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {SPACING_TOP, SPACING_BOTTOM, SPACING_HORIZONTAL} from './shared';
import Container from '../../components/atoms/container';
import Spacing from '../../components/atoms/spacing';

interface LayoutProps {
  toast?: React.ReactNode;
  backgroundColor?: string;
  refresh?: {
    refreshing: boolean;
    onRefresh: () => void;
  };
  scrollViewRef?: MutableRefObject<ScrollView | null>;
  safeArea?: boolean;
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  scrollableStyle?: ViewStyle;
  importantForAccessibility?: AccessibilityProps['importantForAccessibility'];
}

export const Scrollable: FC<LayoutProps> = ({
  toast,
  backgroundColor,
  refresh,
  scrollViewRef,
  safeArea = true,
  children,
  contentContainerStyle,
  scrollableStyle = {},
  importantForAccessibility = 'auto'
}) => {
  const insets = useSafeAreaInsets();
  const refreshControl = refresh && <RefreshControl {...refresh} />;

  return (
    <Container style={[!!backgroundColor && {backgroundColor}]}>
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="always"
        style={scrollableStyle}
        importantForAccessibility={importantForAccessibility}
        contentContainerStyle={[
          styles.scrollView,
          {paddingBottom: (safeArea ? insets.bottom : 0) + SPACING_BOTTOM},
          contentContainerStyle
        ]}
        refreshControl={refreshControl}>
        {toast && (
          <>
            {toast}
            <Spacing s={8} />
          </>
        )}
        {children}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: SPACING_TOP,
    paddingHorizontal: SPACING_HORIZONTAL
  }
});
