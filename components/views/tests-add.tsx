import React, {FC, useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Platform, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';
import {useExposure} from 'react-native-exposure-notification-service';

import Text from '../atoms/text';
import Button from '../atoms/button';
import Spacing from '../atoms/spacing';
import Markdown from '../atoms/markdown';
import {useSettings} from '../../providers/settings';
import {ModalHeader} from '../molecules/modal-header';
import {SPACING_BOTTOM, SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {text, colors} from '../../theme';
import {
  uploadExposureKeys,
  validateCode,
  ValidationResult
} from '../../services/api/exposures';
import {ScreenNames} from '../../navigation';
import {SingleCodeInput} from '../molecules/single-code-input';
import {useReminder} from '../../providers/reminder';
import {useA11yElement} from '../../hooks/a11y-element';

type UploadStatus =
  | 'initialising'
  | 'validate'
  | 'upload'
  | 'uploadOnly'
  | 'success'
  | 'permissionError'
  | 'error';

type Code = string;

interface TestsAddProps {
  navigation: StackNavigationProp<any>;
}

export const TestsAdd: FC<TestsAddProps> = ({navigation}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const exposure = useExposure();
  const {contactTracingNumber} = useSettings();
  const [code, setCode] = useState<Code>('');
  const [status, setStatus] = useState<UploadStatus>('initialising');
  const [validationError, setValidationError] = useState<string>('');
  const [uploadToken, setUploadToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {paused} = useReminder();
  const {focusRef, focusA11yElement} = useA11yElement();

  useEffect(() => {
    const readUploadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('uploadToken');
        if (token) {
          setUploadToken(token);
          setStatus('uploadOnly');
          setValidationError('');
          return;
        }
      } catch (e) {}
      setStatus('validate');
    };
    readUploadToken();
  }, []);

  useEffect(() => {
    if (validationError) {
      focusA11yElement();
    }
  }, [validationError, focusA11yElement]);

  const codeValidationHandler = useCallback(async () => {
    const {result, token} = await validateCode(code.toUpperCase());
    if (result !== ValidationResult.Valid) {
      let errorMessage;
      if (result === ValidationResult.NetworkError) {
        errorMessage = t('common:networkError');
      } else if (result === ValidationResult.Expired) {
        errorMessage = t('tests:code:expiredError');
      } else if (result === ValidationResult.Invalid) {
        errorMessage = t('tests:code:invalidError');
      } else {
        errorMessage = t('tests:code:error');
      }
      setValidationError(errorMessage);
      return;
    }
    try {
      await SecureStore.setItemAsync('uploadToken', token!);
    } catch (e) {
      console.log('Error (secure) storing upload token', e);
    }
    setValidationError('');
    setUploadToken(token!);
    setStatus('upload');
  }, [code, t]);

  useEffect(() => {
    if (code.length !== 6) {
      setValidationError('');
      return;
    }

    codeValidationHandler();
  }, [code, codeValidationHandler]);

  const cleanUploadToken = async () => {
    try {
      await SecureStore.deleteItemAsync('uploadToken');
    } catch (e) {}
  };

  const handleSubmitCode = async () => {
    let exposureKeys;
    try {
      if (paused) {
        await exposure.start();
      }
      exposureKeys = await exposure.getDiagnosisKeys();
      if (exposureKeys === []) {
        cleanUploadToken();
        if (paused) {
          await exposure.pause();
        }
        return navigation.navigate(ScreenNames.testsResult, {dontShare: true});
      }
    } catch (err) {
      cleanUploadToken();
      if (paused) {
        await exposure.pause();
      }
      return navigation.navigate(ScreenNames.testsResult, {dontShare: true});
    }
    try {
      setLoading(true);
      await uploadExposureKeys(uploadToken, exposureKeys);
      setStatus('success');
      setValidationError('');
      setLoading(false);
      if (paused) {
        await exposure.pause();
      }
      navigation.navigate(ScreenNames.testsResult);
    } catch (err) {
      console.log('error uploading exposure keys:', err);
      setValidationError(t('tests:uploadError'));
      setStatus('error');
      setLoading(false);
    }
    cleanUploadToken();
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={[
        styles.contentContainer,
        {paddingBottom: insets.bottom + SPACING_BOTTOM}
      ]}>
      <ModalHeader
        left
        heading="tests:add:heading"
        color="darkGrey"
        back
        backVariant="dark"
      />
      <Spacing s={30} />
      <SingleCodeInput
        error={!!validationError}
        onChange={setCode}
        disabled={status !== 'validate'}
        count={6}
        accessibilityHint={t('tests:add:codeHint')}
        accessibilityLabel={t('tests:add:codeLabel')}
      />
      <Spacing s={24} />
      {status === 'uploadOnly' && (
        <Text variant="leader" color="darkGrey" align="center">
          {t('tests:add:uploadOnlyDescription')}
        </Text>
      )}

      <View ref={focusRef} accessible>
        {!!validationError && (
          <Text variant="h2" color="errorRed" align="center">
            {validationError}
          </Text>
        )}
      </View>
      {!!validationError && <Spacing s={24} />}
      {status !== 'upload' &&
        status !== 'uploadOnly' &&
        validationError !== t('tests:code:expiredError') && (
          <Markdown
            markdownStyles={markdownStyles}
>
            {t('tests:add:description', {
              contactTracingNumber,
              contactTracingNumberTrimmed: contactTracingNumber
                .split(' ')
                .join('')
            })}
          </Markdown>          
        )}

      {validationError === t('tests:code:expiredError') && (
        <Markdown
          markdownStyles={markdownStyles}
          accessibleLink={`tel:${contactTracingNumber.split(' ').join('')}`}>
          {t('tests:add:assistanceMessage', {
            contactTracingNumber,
            contactTracingNumberTrimmed: contactTracingNumber
              .split(' ')
              .join('')
          })}
        </Markdown>
      )}
      <Spacing s={32} />
      {(status === 'upload' || status === 'uploadOnly') && (
        <Button
          onPress={handleSubmitCode}
          label={t('tests:add:submitCode')}
          hint={t('tests:add:submitCodeHint')}>
          {t('tests:add:submitCode')}
        </Button>
      )}
      {loading && (
        <Spinner animation="fade" visible overlayColor={'rgba(0, 0, 0, 0.5)'} />
      )}
    </ScrollView>
  );
};

const markdownStyles = StyleSheet.create({
  text: {
    ...text.leader,
    color: colors.darkGrey
  }
});

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  }
});
