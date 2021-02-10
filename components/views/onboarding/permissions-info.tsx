import React, {FC, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {useExposure} from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Markdown from '../../atoms/markdown';
import {ScreenNames} from '../../../navigation';
import {useSettings} from '../../../providers/settings';
import {useApplication} from '../../../providers/context';
import Container from '../../atoms/container';
import Text from '../../atoms/text';
import {text, colors} from '../../../theme';

const IllustrationSource = require('../../../assets/images/permissions-illustration/image.png');

interface PermissionInfoProps {
  navigation: StackNavigationProp<any>;
}

const PermissionsInfo: FC<PermissionInfoProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {reload} = useSettings();
  const [disabled, setDisabled] = useState(false);
  const {askPermissions} = useExposure();
  const application = useApplication();

  const handlePermissions = async () => {
    setDisabled(true);
    SecureStore.setItemAsync('analyticsConsent', String(true), {});
    try {
      await askPermissions();
      reload();
      await application.setContext({completedExposureOnboarding: true});

      setTimeout(
        () =>
          navigation.reset({
            index: 0,
            routes: [{name: ScreenNames.dashboard}]
          }),
        1000
      );
    } catch (e) {
      setDisabled(false);
      console.log("Error opening app's settings", e);
    }
  };

  return (
    <>
      <Container>
        <Container center="horizontal" stretch={false}>
          <Image
            source={IllustrationSource}
            accessibilityIgnoresInvertColors={false}
          />
        </Container>
        <Spacing s={48} />
        <Text variant="h2" light accessible>
          {t('onboarding:permissionsInfo:view:title')}
        </Text>
        <Spacing s={24} />
        <Markdown markdownStyles={markdownStyles}>
          {t('onboarding:permissionsInfo:view:text')}
        </Markdown>
      </Container>
      <Spacing s={46} />
      <Button
        disabled={disabled}
        onPress={handlePermissions}
        hint={t('common:next:hint')}>
        {t('common:next:label')}
      </Button>
      <Spacing s={24} />
    </>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.default,
    color: colors.white
  }
});

export default PermissionsInfo;
