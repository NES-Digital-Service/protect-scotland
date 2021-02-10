import React, {FC} from 'react';
import {Linking, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useExposure} from 'react-native-exposure-notification-service';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Text from '../../atoms/text';
import Container from '../../atoms/container';

interface UpgradeNoticeProps {}

const UpgradeNotice: FC<UpgradeNoticeProps> = () => {
  const {t} = useTranslation();
  const exposure = useExposure();

  const checkForUpgradeHandler = async () => {
    try {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:');
      } else {
        await exposure.triggerUpdate();
        await exposure.supportsExposureApi();
      }
    } catch (err) {
      console.log('Error handling check for upgrade', err);
    }
  };

  return (
    <>
      <Container>
        <Spacing s={16} />
        <Text variant="h2" light accessible>
          {t(`onboarding:upgradeNotice:${Platform.OS}:title`)}
        </Text>
        <Spacing s={46} />
        <Text light>{t(`onboarding:upgradeNotice:${Platform.OS}:text1`)}</Text>
        <Spacing s={24} />
        <Text variant="h2" light>
          {t('onboarding:upgradeNotice:text2')}
        </Text>
        <Spacing s={24} />
      </Container>
      <Button
        onPress={checkForUpgradeHandler}
        hint={t(
          `onboarding:upgradeNotice:accessibility:${Platform.OS}:upgradeHint`
        )}
        label={t(`onboarding:upgradeNotice:${Platform.OS}:btnLabel`)}>
        {t(`onboarding:upgradeNotice:${Platform.OS}:btnLabel`)}
      </Button>
      {Platform.OS === 'android' && <Spacing s={30} />}
    </>
  );
};

export default UpgradeNotice;
