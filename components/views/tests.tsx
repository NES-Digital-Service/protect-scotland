import React, {FC} from 'react';
import {StyleSheet, ScrollView, Text, Image, Platform} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import Button from '../atoms/button';
import Spacing from '../atoms/spacing';
import {ModalHeader} from '../molecules/modal-header';
import {SPACING_BOTTOM} from '../../theme/layouts/shared';
import {text, colors} from '../../theme';
import {ScreenNames} from '../../navigation';
import ActionCard from '../molecules/action-card';

const JarIcon = require('../../assets/images/icon-jar/image.png');
const Logo = require('../../assets/images/test-view-logo/image.png');
const IconPlus = require('../../assets/images/icon-plus/image.png');

interface TestsProps {
  navigation: StackNavigationProp<any>;
}

export const Tests: FC<TestsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const insets = useSafeArea();

  const handleAddTestResult = () => navigation.navigate(ScreenNames.testsAdd);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: insets.bottom + SPACING_BOTTOM}
      ]}>
      <ModalHeader
        heading="tests:heading"
        color={colors.darkGrey}
        icon={JarIcon}
      />
      <Spacing s={40} />
      <Image
        source={Logo}
        style={styles.logo}
        accessible
        accessibilityIgnoresInvertColors={false}
        accessibilityHint={t('tests:illustrationLabel')}
      />
      <Spacing s={40} />
      <Text style={styles.viewText}>{t('tests:content')}</Text>
      <Spacing s={25} />
      <Button
        onPress={handleAddTestResult}
        icon={IconPlus}
        label={t('tests:addTestResult')}
        variant="dark">
        {t('tests:addTestResult')}
      </Button>
      <Spacing s={54} />
      <ActionCard content={t('tests:view:tellMore')} link={t('links:j')} />
      <Spacing s={54} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logo: {alignSelf: 'center'},
  container: {
    flex: 1
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingLeft: 45,
    paddingRight: 45
  },
  viewText: {
    ...text.leader,
    textAlign: 'center'
  },
  moreInfo: {
    alignSelf: 'flex-start'
  }
});
