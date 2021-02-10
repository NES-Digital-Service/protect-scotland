import React, {FC} from 'react';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Markdown from '../../atoms/markdown';
import Container from '../../atoms/container';
import {OnboardingPageProps} from './common';
import Text from '../../atoms/text';
import {ArrowLink} from '../../molecules/arrow-link';

const IllustrationSource = require('../../../assets/images/why-use-illustration/image.png');

const WhyUse: FC<OnboardingPageProps> = ({handleNext}) => {
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
          {t('onboarding:whyUse:title')}
        </Text>
        <Spacing s={24} />
        <Markdown>{t('onboarding:whyUse:text')}</Markdown>
        <ArrowLink externalLink={t('links:f')}>
          <Text variant="h4" color="primaryPurple">
            {t('onboarding:whyUse:link1')}
          </Text>
        </ArrowLink>
        <Spacing s={16} />
        <ArrowLink externalLink={t('links:q')}>
          <Text variant="h4" color="primaryPurple">
            {t('onboarding:whyUse:link2')}
          </Text>
        </ArrowLink>
        <Spacing s={46} />
      </Container>
      <Button onPress={handleNext} hint={t('common:next:hint')}>
        {t('common:next:label')}
      </Button>
      <Spacing s={24} />
    </>
  );
};

export default WhyUse;
