import React, {FC, useState} from 'react';
import {StyleSheet, Alert, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import {text, colors} from '../../../theme';
import Markdown from '../../atoms/markdown';
import {ArrowLink} from '../../molecules/arrow-link';
import Text from '../../atoms/text';
import Divider from '../../atoms/divider';
import Container from '../../atoms/container';
import Media from '../../atoms/media';
import {useAgeGroupTranslation} from '../../../hooks';
import {useApplication, UserAgeGroup} from '../../../providers/context';

const OptOutIcon = require('../../../assets/images/icon-opt-out/image.png');

interface PrivacyProps {
  handleNext(): void;
  disabled: boolean;
}

const PrivacyAgreement: FC<PrivacyProps> = ({handleNext, disabled}) => {
  const {t} = useTranslation();
  const [pressed, setPressed] = useState(false);
  const {getTranslation} = useAgeGroupTranslation();
  const {user: {ageGroup = UserAgeGroup.ageGroup1} = {}} = useApplication();

  const handleNo = () => {
    setPressed(true);
    Alert.alert(
      t('onboarding:agreement:confirm:title'),
      t('onboarding:agreement:view:confirm:text'),
      [
        {
          text: t('common:close:label'),
          style: 'cancel',
          onPress: () => setPressed(false)
        }
      ]
    );
  };

  return (
    <>
      <Container>
        <Spacing s={24} />
        <Markdown markdownStyles={markdownStyles}>
          {t('onboarding:agreement:view:intro')}
        </Markdown>
        <Spacing s={12} />
        <Divider />
        <Spacing s={30} />
        <Text variant="h2" light accessible>
          {getTranslation('onboarding:agreement:view:title')}
        </Text>
        <Spacing s={46} />
        <Media
          left={
            <>
              <Spacing s={6} />
              <Image
                source={OptOutIcon}
                accessibilityIgnoresInvertColors={false}
              />
            </>
          }>
          <Markdown markdownStyles={optOutMarkdownStyles}>
            {t('onboarding:agreement:view:optOut')}
          </Markdown>
        </Media>
        <Spacing s={46} />
        <Text variant="leader" light>
          {t('onboarding:agreement:view:tc')}
        </Text>
        <Spacing s={32} />
        <ArrowLink invert externalLink={t('links:n')}>
          <Text variant="h4" light>
            {t('onboarding:agreement:view:tcLink')}
          </Text>
        </ArrowLink>
        {ageGroup !== UserAgeGroup.ageGroup1 && (
          <>
            <Spacing s={24} />
            <Text light style={styles.consent}>
              {t('onboarding:agreement:view:consent')}
            </Text>
          </>
        )}
        <Spacing s={48} />
      </Container>
      <Button
        disabled={disabled || pressed}
        onPress={() => {
          setPressed(true);
          handleNext();
          setPressed(false);
        }}>
        {t('common:yes:label')}
      </Button>
      <Spacing s={32} />
      <Button
        type="link"
        disabled={disabled || pressed}
        textColor="white"
        onPress={handleNo}>
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
  }
});

const optOutMarkdownStyles = StyleSheet.create({
  text: {
    ...text.smallerParagraph,
    color: colors.blueGreyLight
  },
  h2: {
    ...text.defaultBold,
    color: colors.blueGreyLight,
    marginBottom: 4
  },
  block: {
    margin: 0
  }
});

const styles = StyleSheet.create({
  consent: {opacity: 0.5}
});

export default PrivacyAgreement;
