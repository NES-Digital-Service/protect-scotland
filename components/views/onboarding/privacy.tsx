import React, {FC} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Markdown from '../../atoms/markdown';
import {ArrowLink} from '../../molecules/arrow-link';
import {colors, text} from '../../../theme';
import {useSettings} from '../../../providers/settings';
import {ScreenNames} from '../../../navigation';

const IconKey = require('../../../assets/images/icon-key/icon-key.png');
const IconEye = require('../../../assets/images/icon-eye/icon-eye.png');

interface PrivacyProps {
  handleNext(): void;
  disabled: boolean;
}

const PrivacyInfo: FC<PrivacyProps> = ({handleNext, disabled}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {solutionText, traceConfiguration} = useSettings();

  return (
    <>
      <View style={styles.container}>
        <Spacing s={24} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconKey} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:privacy:view:textKey', {
                tracePeriod: traceConfiguration.storeExposuresFor
              })}
            </Markdown>
            <ArrowLink
              externalLink={t('links:a')}
              accessibilityHint={t('onboarding:privacy:view:scamsLinkHint')}
              accessibilityLabel={t('onboarding:privacy:view:scamsLink')}
              textStyle={styles.link}
            />
            <ArrowLink
              screen={ScreenNames.dataPolicy}
              navigation={navigation}
              accessibilityHint={t('onboarding:privacy:view:privacyLinkHint')}
              accessibilityLabel={t('onboarding:privacy:view:privacyLink')}
              textStyle={styles.link}
            />
            <Spacing s={10} />
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:privacy:view:textKey1', {solutionText})}
            </Markdown>
          </View>
        </View>
        <Spacing s={24} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconEye} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:privacy:view:textEye')}
            </Markdown>
          </View>
        </View>
        <Spacing s={48} />
      </View>
      <View>
        <Button
          disabled={disabled}
          onPress={handleNext}
          hint={t('common:next:hint')}
          label={t('common:next:label')}>
          {t('common:next:label')}
        </Button>
      </View>
      <Spacing s={50} />
    </>
  );
};

const markdownStyles = StyleSheet.create({
  h1: {
    lineHeight: 20
  }
});

const styles = StyleSheet.create({
  container: {flex: 1},
  column: {flex: 1, flexDirection: 'column'},
  row: {flexDirection: 'row'},
  iconWrapper: {width: 80, paddingLeft: 15, paddingTop: 2},
  link: {
    ...text.h3Heading,
    color: colors.darkGrey,
    paddingVertical: 15
  }
});

export default PrivacyInfo;
