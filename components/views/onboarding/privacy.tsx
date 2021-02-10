import React, {FC} from 'react';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Markdown from '../../atoms/markdown';
import Container from '../../atoms/container';
import {OnboardingPageProps} from './common';
import Text from '../../atoms/text';
import {openBrowserAsync} from '../../../utils/web-browser';

const IllustrationSource = require('../../../assets/images/privacy-illustration/image.png');

const PrivacyInfo: FC<OnboardingPageProps> = ({handleNext}) => {
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
          {t('onboarding:privacy:title')}
        </Text>
        <Spacing s={24} />
        <Markdown>{t('onboarding:privacy:text')}</Markdown>
        <Spacing s={24} />
      </Container>
      <Button
        type="secondary"
        onPress={() => openBrowserAsync(t('links:m'))}
        hint={t('onboarding:privacy:buttonHint')}>
        {t('onboarding:privacy:buttonHint')}
      </Button>
      <Spacing s={16} />
      <Button onPress={handleNext} hint={t('common:next:hint')}>
        {t('common:next:label')}
      </Button>
      <Spacing s={24} />
    </>
  );
};

export default PrivacyInfo;
