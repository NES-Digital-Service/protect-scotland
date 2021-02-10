import React, {FC} from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Share,
  Platform
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

import Container from '../atoms/container';
import Text from '../atoms/text';
import {ModalHeader} from '../molecules/modal-header';
import Spacing from '../atoms/spacing';
import {colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import Button from '../atoms/button';
import RoundedBox from '../atoms/rounded-box';
import {useApplication} from '../../providers/context';
import {ArrowLink} from '../molecules/arrow-link';

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
        color="white"
      />
      <Spacing s={34} />
      <Container stretch={false} center="horizontal">
        <Image
          source={CommunityIllustration}
          accessibilityIgnoresInvertColors={false}
        />
      </Container>
      <Spacing s={43} />
      <Text variant="leader" light align="center">
        {t('community:body')}
      </Text>
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
              <Text variant="h4" light>
                {t('community:figures')}
              </Text>
              <Spacing s={10} />
              <Text light>
                {new Intl.NumberFormat('en-GB').format(appRegistrationsCount)}
              </Text>
            </View>
            <Image
              source={DownloadsIllustration}
              accessibilityIgnoresInvertColors={false}
            />
          </View>
        </RoundedBox>
      )}
      <Spacing s={45} />
      <ArrowLink externalLink={t('links:q')} invert>
        <Text variant="h4" light>
          {t('community:link')}
        </Text>
      </ArrowLink>
      <Spacing s={140} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%'
  },
  textContainer: {
    paddingRight: 10,
    flex: 1
  },
  button: {
    width: '100%'
  },
  downloads: {
    borderColor: colors.white
  }
});
