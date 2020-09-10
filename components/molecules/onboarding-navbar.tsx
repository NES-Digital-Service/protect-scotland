import React, {FC} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../atoms/button';
import ProgressBar from '../atoms/progress-bar';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {colors} from '../../theme';

const IconBack = require('../../assets/images/back/image.png');

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
        {canGoBack ? (
          <Button
            style={styles.back}
            onPress={goBack}
            type="back"
            hint={t('common:back:hint')}
            label={t('common:back:label')}>
            <Image
              style={styles.iconSize}
              source={IconBack}
              accessibilityIgnoresInvertColors={false}
            />
          </Button>
        ) : (
          <View style={styles.back} />
        )}
        <ProgressBar
          style={styles.progressBar}
          sections={sections}
          activeSection={activeSection}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryPurple,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 42,
    paddingHorizontal: SPACING_HORIZONTAL,
    alignItems: 'center',
    position: 'absolute',
    zIndex: 20
  },
  back: {
    width: 30,
    height: 30,
    marginRight: 24
  },
  progressBar: {
    flex: 1
  },
  iconSize: {
    width: 16,
    height: 8
  },
  wave: {
    position: 'absolute',
    zIndex: 10
  }
});

export default NavBar;
