import React, {FC} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import Spacing from '../atoms/spacing';
import {ModalHeader} from '../molecules/modal-header';
import {SPACING_BOTTOM} from '../../theme/layouts/shared';
import Illustration from '../atoms/illustration';
import Markdown from '../atoms/markdown';
import {PADDING_TOP, text, colors} from '../../theme';
import {useNavigation} from '@react-navigation/native';

const CalculatorIllustration = require('../../assets/images/calculator-illustration/image.png');

interface CalculatorModalProps {
  navigation: StackNavigationProp<any>;
}

export const CalculatorModal: FC<CalculatorModalProps> = () => {
  const {t} = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: insets.bottom + SPACING_BOTTOM}
      ]}>
      <ModalHeader
        heading="calculator:heading"
        color="amber"
        onClosePress={() => navigation.goBack()}
      />
      <View style={styles.top}>
        <Illustration
          source={CalculatorIllustration}
          accessibilityIgnoresInvertColors={false}
          accessibilityHint={t('calculator:illustrationAlt')}
          accessibilityLabel={t('calculator:illustrationAlt')}
        />
        <Markdown markdownStyles={markdownStyles}>
          {t('calculator:body')}
        </Markdown>
        <Spacing s={18} />
        <Text style={styles.highlight}>{t('calculator:highlight')}</Text>
        <Spacing s={50} />
      </View>
    </ScrollView>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.paragraph,
    color: colors.darkerPurple
  },
  // @ts-ignore
  strong: {
    ...text.h4Heading,
    color: colors.darkerPurple
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: PADDING_TOP,
    paddingLeft: 45,
    paddingRight: 45
  },
  top: {flex: 1},
  highlight: {
    ...text.h3Heading,
    color: colors.amber
  }
});
