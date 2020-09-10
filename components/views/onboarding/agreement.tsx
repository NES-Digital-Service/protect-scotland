import React, {FC, useState} from 'react';
import {Text, StyleSheet, View, Image, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import {text, colors} from '../../../theme';
import Markdown from '../../atoms/markdown';
import RoundedBox from '../../atoms/rounded-box';
import {ScreenNames} from '../../../navigation';
import {ArrowLink} from '../../molecules/arrow-link';

const IconBell = require('../../../assets/images/icon-bell/icon-bell.png');

interface PrivacyProps {
  handleNext(): void;

  disabled: boolean;
}

const PrivacyAgreement: FC<PrivacyProps> = ({handleNext, disabled}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [pressed, setPressed] = useState(false);

  const handleNo = () => {
    setPressed(true);
    Alert.alert(
      t('onboarding:agreement:confirm:title'),
      t('onboarding:agreement:confirm:description'),
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
    <View style={styles.container}>
      <Spacing s={24} />
      <View style={styles.row}>
        <View style={styles.iconWrapper}>
          <Image source={IconBell} accessibilityIgnoresInvertColors={false} />
        </View>
        <View style={styles.column}>
          <Markdown markdownStyles={markdownStyles}>
            {t('onboarding:agreement:view:textBell')}
          </Markdown>
        </View>
      </View>
      <Spacing s={28} />
      <Text style={styles.moreText}>
        {t('onboarding:agreement:view:confirmation')}
      </Text>
      <Spacing s={24} />
      <Text style={styles.viewText}>{t('onboarding:agreement:view:tc')}</Text>
      <Spacing s={18} />
      <ArrowLink
        screen={ScreenNames.terms}
        navigation={navigation}
        accessibilityHint={t('onboarding:agreement:view:tcLinkHint')}
        accessibilityLabel={t('onboarding:agreement:view:tcLink')}
        textStyle={styles.termsLink}
      />
      <Spacing s={34} />
      <View>
        <Button
          disabled={disabled || pressed}
          onPress={() => {
            setPressed(true);
            handleNext();
          }}
          hint={t('onboarding:agreement:accessibility:yesHint')}
          label={t('onboarding:agreement:accessibility:yesLabel')}>
          {t('common:yes:label')}
        </Button>
        <Spacing s={15} />
        <Button
          disabled={disabled || pressed}
          type="secondary"
          onPress={handleNo}
          hint={t('onboarding:agreement:accessibility:noHint')}
          label={t('onboarding:agreement:accessibility:noLabel')}>
          {t('common:no:label')}
        </Button>
      </View>
      <Spacing s={30} />
      <RoundedBox style={styles.optOut}>
        <Markdown markdownStyles={optOutMarkdownStyles}>
          {t('onboarding:agreement:view:optOut')}
        </Markdown>
      </RoundedBox>
      <Spacing s={48} />
    </View>
  );
};

const markdownStyles = StyleSheet.create({
  h1: {
    lineHeight: 20
  }
});

const optOutMarkdownStyles = StyleSheet.create({
  h2: {
    ...text.leader,
    color: colors.darkGrey,
    marginBottom: 20
  }
});

const styles = StyleSheet.create({
  container: {flex: 1},
  column: {flex: 1, flexDirection: 'column'},
  row: {flexDirection: 'row'},
  iconWrapper: {width: 80, paddingLeft: 15, paddingTop: 2},
  viewText: {
    ...text.default
  },
  moreText: {
    ...text.leader
  },
  termsLink: {
    ...text.h3Heading,
    color: colors.darkGrey
  },
  optOut: {
    borderColor: colors.primaryPurple
  }
});

export default PrivacyAgreement;
