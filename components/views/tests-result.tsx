import React, {FC} from 'react';
import {StyleSheet, ScrollView, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import Container from '../atoms/container';
import Text from '../atoms/text';
import Button from '../atoms/button';
import Spacing from '../atoms/spacing';
import {ModalHeader} from '../molecules/modal-header';
import {SPACING_BOTTOM, SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {text, colors} from '../../theme';
import Markdown from '../atoms/markdown';
import {ScreenNames} from '../../navigation';
import {ArrowLink} from '../molecules/arrow-link';
import {useSettings} from '../../providers/settings';

type ParamList = {
  'tests.result': {
    dontShare?: boolean;
  };
};

interface TestsResultProps {
  navigation: StackNavigationProp<any>;
  route: RouteProp<ParamList, 'tests.result'>;
  dontShare?: boolean;
}

export const TestsResult: FC<TestsResultProps> = ({navigation, route}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {copy} = useSettings();

  const dontShare = route.params && route.params.dontShare;

  const handleDone = () => navigation.navigate(ScreenNames.dashboard);

  const handleResubmit = () => navigation.goBack();

  return (
    <>
      <ScrollView
        style={[{paddingBottom: insets.bottom + SPACING_BOTTOM}]}
        contentContainerStyle={[
          styles.contentContainer,
          {paddingBottom: insets.bottom + SPACING_BOTTOM}
        ]}>
        <ModalHeader
          heading={dontShare ? undefined : 'tests:result:heading'}
          color="darkGrey"
          left
        />
        {!dontShare && <Spacing s={40} />}
        <Container>
          <Markdown markdownStyles={markdownStyle}>
            {dontShare ? copy.testResult.text2 : copy.testResult.text1}
          </Markdown>
          {!dontShare && <Spacing s={40} />}
          {!dontShare && (
            <ArrowLink
              externalLink={t('links:j')}
              accessibilityHint={t('tests:view:a11y:hint')}
              accessibilityLabel={t('tests:view:a11y:label')}>
              <Text variant="h4" color="primaryPurple">
                {t('tests:view:tellMore')}
              </Text>
            </ArrowLink>
          )}
          <Spacing s={dontShare ? 28 : 47} />
        </Container>
        {dontShare && (
          <>
            <Button
              onPress={handleResubmit}
              label={t('tests:result:resubmitLabel')}
              hint={t('tests:result:resubmitHint')}>
              {t('tests:result:resubmitLabel')}
            </Button>
            <Spacing s={45} />
          </>
        )}
        <Button
          onPress={handleDone}
          label={t('tests:result:doneLabel')}
          hint={t('tests:result:doneHint')}
          type={dontShare ? 'link' : undefined}
          textColor={dontShare ? 'darkerPurple' : undefined}>
          {t('common:done')}
        </Button>
        {dontShare && (
          <>
            <Spacing s={64} />
            <ArrowLink
              externalLink={t('links:j')}
              accessibilityHint={t('tests:view:a11y:hint')}
              accessibilityLabel={t('tests:view:a11y:label')}>
              <Text variant="h4" color="primaryPurple">
                {t('tests:view:tellMore')}
              </Text>
            </ArrowLink>
          </>
        )}
        <Spacing s={50} />
      </ScrollView>
    </>
  );
};

const markdownStyle = StyleSheet.create({
  text: {
    ...text.leader,
    color: colors.darkGrey
  },
  strong: {
    ...text.paragraph
  }
});

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
});
