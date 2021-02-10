import React, {FC, useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import {useExposure} from 'react-native-exposure-notification-service';
import * as SecureStore from 'expo-secure-store';
import {useNavigation} from '@react-navigation/native';

import Spacing from '../atoms/spacing';
import {ModalHeader} from '../molecules/modal-header';
import {SPACING_BOTTOM} from '../../theme/layouts/shared';
import Illustration from '../atoms/illustration';
import Markdown from '../atoms/markdown';
import {PADDING_TOP, text, colors} from '../../theme';
import Button from '../atoms/button';
import {getIsolationEndDate} from '../../utils/exposure';
import {ScreenNames} from '../../navigation';
import {useSettings} from '../../providers/settings';

import {createNotice, validateNoticeKey} from '../../services/api';

const SendNoticeIllustration = require('../../assets/images/send-notice-illustration/image.png');

interface SendNoticeProps {
  navigation: StackNavigationProp<any>;
}

const getCertificateKeyFromStorage = async (): Promise<string | boolean> => {
  try {
    const data = await SecureStore.getItemAsync('createNoticeCertKey');

    if (!data) {
      return false;
    }

    const {key} = JSON.parse(data);

    if (!key) {
      return false;
    }

    const isValidKey = await validateNoticeKey(key);

    if (!isValidKey) {
      return false;
    }

    return key;
  } catch (err) {
    console.log('Error retrieving createNoticeCertKey', err);
    return false;
  }
};

const getKey = async (selfIsolationDate: string): Promise<string | boolean> => {
  try {
    const storageKey = await getCertificateKeyFromStorage();

    if (storageKey) {
      console.log('USING STORAGE KEY', storageKey);
      return storageKey;
    }

    const {key} = await createNotice(selfIsolationDate);

    if (key) {
      console.log('USING CREATED KEY', key);
      return key;
    }

    return false;
  } catch (err) {
    console.log('Error getting key', err);
    return false;
  }
};

export const SendNotice: FC<SendNoticeProps> = () => {
  const {t} = useTranslation();
  const insets = useSafeArea();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const {contacts} = useExposure();
  const {noticesWebPageURL, isolationDuration} = useSettings();

  const handleOnSendNoticeRequest = useCallback(() => {
    const createNoticeApi = async (selfIsolationDate: string) => {
      try {
        const key = await getKey(selfIsolationDate);

        if (!key) {
          return setError(true);
        }

        setError(false);

        await SecureStore.setItemAsync(
          'createNoticeCertKey',
          JSON.stringify({key, selfIsolationDate})
        );

        const url = `${noticesWebPageURL}?key=${key}`;

        await WebBrowser.openBrowserAsync(url, {
          enableBarCollapsing: true,
          showInRecents: true
        });

        navigation.navigate(ScreenNames.closeContact);
      } catch (err) {
        console.log(err);
        setError(true);
      }
    };
    const selfIsolationEndDate = getIsolationEndDate(
      isolationDuration,
      contacts,
      'yyyy-MM-dd'
    );

    setIsLoading(true);

    if (selfIsolationEndDate && noticesWebPageURL) {
      createNoticeApi(selfIsolationEndDate.formatted);
    }

    if (!noticesWebPageURL) {
      setError(true);
    }
  }, [contacts, noticesWebPageURL, isolationDuration, navigation]);

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: insets.bottom + SPACING_BOTTOM}
      ]}>
      <ModalHeader
        heading="sendNotice:heading"
        onClosePress={navigation.goBack}
      />
      <View style={styles.top}>
        <Illustration
          source={SendNoticeIllustration}
          accessibilityIgnoresInvertColors={false}
        />
        <Markdown markdownStyles={markdownStyles}>
          {t('sendNotice:body')}
        </Markdown>
        <Spacing s={42} />
        {error && (
          <>
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {t('common:tryAgain:description')}
              </Text>
            </View>
            <Spacing s={20} />
          </>
        )}
        <Button
          variant="dark"
          onPress={handleOnSendNoticeRequest}
          label={t('sendNotice:continueLabel')}
          hint={t('sendNotice:continueHint')}
          disabled={isLoading}
          textColor="white"
          style={styles.button}>
          {t('common:continue')}
        </Button>
        <Spacing s={50} />
      </View>
    </ScrollView>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.paragraph
  },
  strong: {
    ...text.h4Heading
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
  button: {
    borderColor: colors.darkerPurple,
    width: '100%'
  },
  errorBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10
  },
  errorText: {
    color: colors.errorRed
  }
});
