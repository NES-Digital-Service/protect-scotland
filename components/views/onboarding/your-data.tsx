import React, {FC} from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import {text} from '../../../theme';
import Markdown from '../../atoms/markdown';

const IconBell = require('../../../assets/images/icon-bell/icon-bell.png');
const IconUnion = require('../../../assets/images/icon-union/icon-union.png');

interface YourDataProps {
  handleNext(): void;
}

const YourData: FC<YourDataProps> = ({handleNext}) => {
  const {t} = useTranslation();
  return (
    <>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image
              resizeMethod="resize"
              resizeMode="contain"
              source={IconUnion}
              accessibilityIgnoresInvertColors={false}
            />
          </View>
          <View style={styles.column}>
            <Markdown>{t('onboarding:yourData:view:textUnion')}</Markdown>
          </View>
        </View>
        <Spacing s={24} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image
              resizeMethod="resize"
              resizeMode="contain"
              source={IconBell}
              accessibilityIgnoresInvertColors={false}
            />
          </View>
          <View style={styles.column}>
            <Markdown>{t('onboarding:yourData:view:textBell')}</Markdown>
          </View>
        </View>
      </View>
      <Spacing s={24} />
      <View>
        <Button
          onPress={handleNext}
          hint={t('onboarding:yourData:accessibility:nextHint')}
          label={t('onboarding:yourData:accessibility:nextLabel')}>
          {t('common:next:label')}
        </Button>
      </View>
      <Spacing s={50} />
    </>
  );
};

const styles = StyleSheet.create({
  underline: {textDecorationLine: 'underline'},
  column: {flex: 1, flexDirection: 'column'},
  row: {flexDirection: 'row'},
  iconWrapper: {width: 80, paddingLeft: 15, paddingTop: 2},
  viewText: {
    ...text.default
  },
  termsLink: {
    ...text.default
  }
});

export default YourData;
