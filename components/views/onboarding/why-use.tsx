import React, {FC} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../../atoms/button';
import {text} from '../../../theme';
import Spacing from '../../atoms/spacing';
import Markdown from '../../atoms/markdown';

interface WhyUseProps {
  handleNext(): void;
}

const WhyUse: FC<WhyUseProps> = ({handleNext}) => {
  const {t} = useTranslation();

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.viewText}>{t('onboarding:whyUse:view:main')}</Text>
        <Spacing s={24} />
        <Markdown markdownStyles={markdownStyles}>
          {t('onboarding:whyUse:view:text')}
        </Markdown>
        <Spacing s={24} />
      </View>
      <View>
        <Button
          onPress={handleNext}
          hint={t('onboarding:whyUse:accessibility:nextHint')}
          label={t('common:next:label')}>
          {t('common:next:label')}
        </Button>
      </View>
      <Spacing s={50} />
    </>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.paragraph
  },
  strong: {
    ...text.defaultBold
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  viewText: {
    ...text.leader
  }
});

export default WhyUse;
