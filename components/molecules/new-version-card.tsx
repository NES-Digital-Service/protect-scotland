import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform,
  Linking
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors} from '../../theme';
import Spacing from '../atoms/spacing';
import Text from '../atoms/text';
import RoundedBox from '../atoms/rounded-box';

export const NewVersionCard = () => {
  const {t} = useTranslation();

  const onUpdate = () => {
    Linking.openURL(
      Platform.OS === 'ios'
        ? t('newVersion:appstoreUrl')
        : t('newVersion:playstoreUrl')
    );
  };

  return (
    <TouchableWithoutFeedback onPress={onUpdate}>
      <View>
        <RoundedBox style={styles.content}>
          <Text variant="h4">
            {t('newVersion:title', {
              storeName:
                Platform.OS === 'ios'
                  ? t('newVersion:appstore')
                  : t('newVersion:playstore')
            })}
          </Text>
          <Spacing s={8} />
          <Text bold color="errorRed">
            {t('newVersion:link')}
          </Text>
        </RoundedBox>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  content: {
    borderColor: colors.primaryPurple,
    width: 'auto'
  }
});
