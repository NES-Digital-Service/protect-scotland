import React, {FC} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Container from '../../atoms/container';
import Divider from '../../atoms/divider';
import {OnboardingPageProps} from './common';
import {ArrowLink} from '../../molecules/arrow-link';
import Text from '../../atoms/text';
import Markdown from '../../atoms/markdown';
import {colors, text} from '../../../theme';
import {useApplication, UserAgeGroup} from '../../../providers/context';
import {useAgeGroupTranslation} from '../../../hooks';

interface TermsNoticeProps extends OnboardingPageProps {
  navigation: StackNavigationProp<any>;
}

const TermsNotice: FC<TermsNoticeProps> = ({
  navigation,
  handleNext: handleNextProp
}) => {
  const {t} = useTranslation();
  const {user: {ageGroup = UserAgeGroup.ageGroup1} = {}} = useApplication();
  const {getTranslation} = useAgeGroupTranslation();

  const handleNext = () => {
    if (ageGroup === UserAgeGroup.ageGroup2) {
      return Alert.alert(t('ageRequirement:alert:title'), undefined, [
        {
          text: t('common:back:label'),
          onPress: () => navigation.popToTop()
        },
        {
          text: t('ageRequirement:button:ageGroup2:label'),
          onPress: handleNextProp
        }
      ]);
    }
    return handleNextProp();
  };

  const handleNo = () =>
    Alert.alert(
      t('onboarding:agreement:confirm:title'),
      t('onboarding:agreement:confirm:text'),
      [
        {
          text: t('common:close:label')
        }
      ]
    );

  return (
    <>
      <Container>
        <Spacing s={16} />
        <Text variant="h2" light accessible>
          {t('onboarding:agreement:notice:title')}
        </Text>
        {ageGroup === UserAgeGroup.ageGroup3 && (
          <>
            <Spacing s={42} />
            <Text variant="h2" light>
              {t('onboarding:agreement:notice:subtitle')}
            </Text>
          </>
        )}
        <Spacing s={42} />
        <Markdown markdownStyles={markdownStyles}>
          {getTranslation('onboarding:agreement:notice:text')}
        </Markdown>
        {ageGroup !== UserAgeGroup.ageGroup3 && (
          <>
            <Spacing s={36} />
            <ArrowLink externalLink={t('links:m')} invert>
              <Text variant="h4" light>
                {t('onboarding:agreement:notice:link')}
              </Text>
            </ArrowLink>
          </>
        )}
        {ageGroup === UserAgeGroup.ageGroup2 && (
          <>
            <Spacing s={36} />
            <Text light>{t('onboarding:agreement:notice:additionalText')}</Text>
          </>
        )}
        <Spacing s={36} />
        <Divider />
        <Spacing s={36} />
        <Text variant="leader" light>
          {getTranslation('onboarding:agreement:notice:consent')}
        </Text>
        <Spacing s={48} />
      </Container>
      <Button onPress={handleNext}>{t('common:yes:label')}</Button>
      <Spacing s={32} />
      <Button type="link" textColor="white" onPress={handleNo}>
        {t('common:no:label')}
      </Button>
      <Spacing s={16} />
    </>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.default,
    color: colors.white
  },
  strong: {
    fontFamily: text.fontFamily.robotoBold
  },
  block: {margin: 0}
});

export default TermsNotice;
