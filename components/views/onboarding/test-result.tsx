import React, {FC} from 'react';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Markdown from '../../atoms/markdown';
import Container from '../../atoms/container';
import {OnboardingPageProps} from './common';
import Text from '../../atoms/text';
import {ScreenNames} from '../../../navigation';
import {useNavigation} from '@react-navigation/native';

const IllustrationSource = require('../../../assets/images/test-result-illustration/image.png');

const TestResult: FC<OnboardingPageProps> = ({handleNext}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <>
      <Container>
        <Container center="horizontal" stretch={false}>
          <Image
            source={IllustrationSource}
            accessibilityIgnoresInvertColors={false}
          />
        </Container>
        <Spacing s={48} />
        <Text variant="h2" accessible>
          {t('onboarding:testResult:title')}
        </Text>
        <Spacing s={24} />
        <Markdown>{t('onboarding:testResult:text')}</Markdown>
        <Spacing s={24} />
      </Container>
      <Button
        type="secondary"
        onPress={() => navigation.navigate(ScreenNames.testResultModal)}
        hint={t('onboarding:testResult:buttonHint')}>
        {t('onboarding:testResult:buttonLabel')}
      </Button>
      <Spacing s={16} />
      <Button onPress={handleNext} hint={t('common:next:hint')}>
        {t('common:next:label')}
      </Button>
      <Spacing s={24} />
    </>
  );
};

export default TestResult;
