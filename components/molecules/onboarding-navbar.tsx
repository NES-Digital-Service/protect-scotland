import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Container from '../atoms/container';
import ProgressBar from '../atoms/progress-bar';
import {Back} from '../atoms/back';

interface NavBarProps {
  goBack(): void;
  sections: number;
  activeSection: number;
  canGoBack: boolean;
}

const NavBar: FC<NavBarProps> = ({
  goBack,
  sections,
  activeSection,
  canGoBack
}) => {
  const {t} = useTranslation();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.back}>
          {canGoBack && <Back onPress={goBack} />}
        </View>
        <Container
          center="vertical"
          accessible
          accessibilityHint={t('onboarding:navbar:accessibilityHint', {
            step: activeSection,
            total: sections
          })}>
          <ProgressBar sections={sections} activeSection={activeSection} />
        </Container>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 40,
    paddingBottom: 20,
    width: '100%'
  },
  back: {
    width: 30,
    height: 30,
    marginRight: 24
  },
  wave: {
    position: 'absolute',
    zIndex: 10
  }
});

export default NavBar;
