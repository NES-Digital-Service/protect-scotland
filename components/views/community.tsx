import React, {FC} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Share,
  Platform
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

import {ModalHeader} from '../molecules/modal-header';
import Spacing from '../atoms/spacing';
import {text, colors} from '../../theme';
import Button from '../atoms/button';
import RoundedBox from '../atoms/rounded-box';
import {useApplication} from '../../providers/context';

const CommunityIcon = require('../../assets/images/icon-community-white/image.png');
const CommunityIllustration = require('../../assets/images/community-illustration/image.png');
const DownloadsIllustration = require('../../assets/images/downloads-illustration/image.png');

export const shareApp = async (t: TFunction) => {
  const url = t('links:l');
  try {
    await Share.share(
      {
        title: t('common:shareMessage'),
        message: Platform.OS === 'android' ? url : undefined,
        url
      },
      {
        subject: t('common:name'),
        dialogTitle: t('common:name')
      }
    );
  } catch (error) {}
};

export const Community: FC = () => {
  const {t} = useTranslation();
  const {data} = useApplication();

  let appRegistrationsCount = 0;
  if (data?.installs.length) {
    appRegistrationsCount = data.installs[data.installs.length - 1][1];
  }

  return (
    <ScrollView style={styles.container}>
      <ModalHeader
        icon={CommunityIcon}
        heading="community:heading"
        color={colors.white}
      />
      <Spacing s={34} />
      <View style={styles.content}>
        <Image
          source={CommunityIllustration}
          accessible
          accessibilityIgnoresInvertColors={false}
          accessibilityHint={t('community:illustrationLabel')}
        />
        <Spacing s={43} />
        <Text style={styles.body}>{t('community:body')}</Text>
        <Spacing s={26} />
        <Button
          onPress={() => shareApp(t)}
          style={styles.button}
          variant="dark"
          label={t('common:share')}>
          {t('common:share')}
        </Button>
        <Spacing s={40} />
        {data && (
          <RoundedBox style={styles.downloads}>
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Text style={[styles.text, styles.heading]}>
                  {t('community:figures')}
                </Text>
                <Spacing s={10} />
                <Text style={[styles.text]}>
                  {new Intl.NumberFormat('en-GB').format(appRegistrationsCount)}
                </Text>
              </View>
              <Image
                source={DownloadsIllustration}
                accessible
                accessibilityIgnoresInvertColors={false}
                accessibilityHint={t('community:downloadsLabel')}
              />
            </View>
          </RoundedBox>
        )}
        <Spacing s={20} />
      </View>
      <Spacing s={80} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingLeft: 45,
    paddingRight: 45
  },
  content: {
    flex: 1,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%'
  },
  body: {
    ...text.leader,
    color: colors.white,
    textAlign: 'center'
  },
  textContainer: {
    paddingRight: 20,
    flex: 1
  },
  heading: {
    ...text.h4Heading
  },
  text: {
    ...text.default,
    color: colors.white
  },
  button: {
    width: '100%'
  },
  downloads: {
    borderColor: colors.white
  }
});
