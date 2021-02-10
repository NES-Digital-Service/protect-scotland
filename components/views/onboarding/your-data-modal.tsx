import React from 'react';
import {View, ScrollView, StyleSheet, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import Markdown from '../../atoms/markdown';
import Spacing from '../../atoms/spacing';
import {colors, text} from '../../../theme';
import {ModalClose} from '../../atoms/modal-close';
import Illustration from '../../atoms/illustration';
import {useApplication, UserAgeGroup} from '../../../providers/context';
import Text from '../../atoms/text';

const ModalIllustrationSource = require('../../../assets/images/your-data-modal-illustration/image.png');
const ageGroup1AlertAndroid = require('../../../assets/images/notification/android/age-group-1/image.png');
const ageGroup23AlertAndroid = require('../../../assets/images/notification/android/age-group-2-3/image.png');

const ageGroup1AlertIos = require('../../../assets/images/notification/ios/age-group-1/image.png');
const ageGroup23AlertIos = require('../../../assets/images/notification/ios/age-group-2-3/image.png');

const getImageSource = (ageGroup?: UserAgeGroup) => {
  if (ageGroup === UserAgeGroup.ageGroup1) {
    return Platform.OS === 'ios' ? ageGroup1AlertIos : ageGroup1AlertAndroid;
  } else {
    return Platform.OS === 'ios' ? ageGroup23AlertIos : ageGroup23AlertAndroid;
  }
};

export const YourDataModal: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {user: {ageGroup = UserAgeGroup.ageGroup1} = {}} = useApplication();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.modal,
        {marginTop: insets.top + (Platform.OS === 'android' ? 25 : 5)}
      ]}>
      <View style={styles.header}>
        <ModalClose onPress={() => navigation.goBack()} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <Text
          variant="h2"
          color="darkerPurple"
          accessible
          style={styles.narrow}
          align="center">
          {t('onboarding:yourData:modal:title')}
        </Text>
        <Illustration source={ModalIllustrationSource} />
        <Markdown markdownStyles={modalMarkdownStyles} style={styles.narrow}>
          {t('onboarding:yourData:modal:content')}
        </Markdown>
        <Illustration
          accessible
          source={getImageSource(ageGroup)}
          fullWidth
          accessibilityHint={t(
            'onboarding:yourData:modal:notificationIllustrationAlt'
          )}
        />
        <Spacing s={60} />
      </ScrollView>
    </View>
  );
};

const modalMarkdownStyles = StyleSheet.create({
  text: {
    ...text.paragraph,
    color: colors.darkerPurple
  }
});

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.backgroundYellow,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    flex: 1
  },
  contentContainerStyle: {
    flexGrow: 1
  },
  narrow: {paddingHorizontal: 35},
  header: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
