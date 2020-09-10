import React, {FC, useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {useExposure} from 'react-native-exposure-notification-service';

import Button from '../../atoms/button';
import Spacing from '../../atoms/spacing';
import Markdown from '../../atoms/markdown';
import {text} from '../../../theme';
import {ScreenNames} from '../../../navigation';
import {useSettings} from '../../../providers/settings';
import {useApplication} from '../../../providers/context';
import * as SecureStore from 'expo-secure-store';

const IconBell = require('../../../assets/images/icon-bell/icon-bell.png');
const IconBt = require('../../../assets/images/icon-bt/icon-bt.png');

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

      setTimeout(() => navigation.replace(ScreenNames.dashboard), 1000);
    } catch (e) {
      setDisabled(false);
      console.log("Error opening app's settings", e);
    }
  };

  return (
    <View style={styles.container}>
      <Spacing s={24} />
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconBt} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:permissionsInfo:view:item1')}
            </Markdown>
          </View>
        </View>
        <Spacing s={28} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconBell} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Text style={[styles.viewText, styles.bold]}>
              {t('onboarding:permissionsInfo:view:item2')}
            </Text>
          </View>
        </View>
      </View>
      <Spacing s={56} />
      <Button
        disabled={disabled}
        onPress={handlePermissions}
        hint={t('onboarding:permissionsInfo:accessibility:nextHint')}
        label={t('onboarding:permissionsInfo:accessibility:nextLabel')}>
        {t('common:next:label')}
      </Button>
      <Spacing s={20} />
    </View>
  );
};

const markdownStyles = StyleSheet.create({
  h1: {
    lineHeight: 20
  }
});

const styles = StyleSheet.create({
  container: {flex: 1},
  column: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {flexDirection: 'row'},
  iconWrapper: {
    width: 80,
    paddingLeft: 15,
    paddingTop: 2
  },
  viewText: {
    ...text.default
  },
  bold: {
    ...text.defaultBold
  }
});

export default PermissionsInfo;
