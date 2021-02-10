import React, {FC} from 'react';
import {StyleSheet, ScrollView, Image, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import Text from '../atoms/text';
import Button from '../atoms/button';
import Spacing from '../atoms/spacing';
import {ModalHeader} from '../molecules/modal-header';
import {SPACING_BOTTOM, SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {ScreenNames} from '../../navigation';
import {ArrowLink} from '../molecules/arrow-link';
import {openBrowserAsync} from '../../utils/web-browser';

const JarIcon = require('../../assets/images/icon-jar/image.png');
const Illustration = require('../../assets/images/test-illustration/image.png');
const IconPlus = require('../../assets/images/icon-plus/image.png');

interface TestsProps {
  navigation: StackNavigationProp<any>;
}

export const Tests: FC<TestsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const handleAddTestResult = () => navigation.navigate(ScreenNames.testsAdd);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: insets.bottom + SPACING_BOTTOM}
      ]}>
      <ModalHeader heading="tests:heading" color="darkGrey" icon={JarIcon} />
      <Spacing s={40} />
      <Image
        source={Illustration}
        style={styles.logo}
        accessibilityIgnoresInvertColors={false}
      />
      <Spacing s={40} />
      <Text align="center" variant="leader" color="darkGrey">
        {t('tests:content')}
      </Text>
      <Spacing s={25} />
      <Button
        onPress={handleAddTestResult}
        icon={IconPlus}
        label={t('tests:addTestResult')}
        variant="dark">
        {t('tests:addTestResult')}
      </Button>
      <Spacing s={25} />
      <Button
        onPress={() => openBrowserAsync(t('links:t'))}
        label={t('tests:bookATest')}
        variant="inverted">
        {t('tests:bookATest')}
      </Button>
      <Spacing s={54} />
      <ArrowLink
        externalLink={t('links:j')}
        accessibilityHint={t('tests:view:a11y:hint')}
        accessibilityLabel={t('tests:view:a11y:label')}>
        <Text variant="h4" color="primaryPurple">
          {t('tests:view:tellMore')}
        </Text>
      </ArrowLink>
      <Spacing s={54} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logo: {alignSelf: 'center'},
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  }
});
