import React, {FC} from 'react';
import {View, StyleSheet, ScrollView, Text, Platform} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import Button from '../atoms/button';
import Spacing from '../atoms/spacing';
import {ModalHeader} from '../molecules/modal-header';
import {SPACING_BOTTOM} from '../../theme/layouts/shared';
import {text, colors} from '../../theme';
import Markdown from '../atoms/markdown';
import {ScreenNames} from '../../navigation';
import ActionCard from '../molecules/action-card';

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
  const insets = useSafeArea();

  const dontShare = route.params && route.params.dontShare;

  const handleDone = () => navigation.navigate(ScreenNames.dashboard);

  const handleResubmit = () => navigation.goBack();

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          {paddingBottom: insets.bottom + SPACING_BOTTOM}
        ]}
        contentContainerStyle={[
          styles.contentContainer,
          {paddingBottom: insets.bottom + SPACING_BOTTOM}
        ]}>
        <ModalHeader
          heading={dontShare ? undefined : 'tests:result:heading'}
          color={colors.darkGrey}
          left
        />
        <Spacing s={40} />
        <View style={styles.top}>
          <Text style={styles.text}>{t('tests:result:advice')}</Text>
          <Spacing s={28} />
          {dontShare ? (
            <Markdown>{t('tests:result:label2dontShare')}</Markdown>
          ) : (
            <Markdown markdownStyles={markdownStyle}>
              {t('tests:result:label2')}
            </Markdown>
          )}
          <Spacing s={dontShare ? 28 : 105} />
          {!dontShare && (
            <ActionCard
              inverted
              content={t('tests:view:tellMore')}
              link={t('links:j')}
            />
          )}
          <Spacing s={dontShare ? 28 : 47} />
        </View>
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
          textColor={dontShare ? colors.darkerPurple : undefined}>
          {t('common:done')}
        </Button>
        {dontShare && (
          <>
            <Spacing s={64} />
            <ActionCard
              inverted
              content={t('tests:view:tellMore')}
              link={t('links:j')}
            />
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
    fontFamily: text.fontFamily.latoBold
  }
});

const styles = StyleSheet.create({
  top: {flex: 1},
  container: {
    flex: 1
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingLeft: 45,
    paddingRight: 45
  },
  text: {
    ...text.leader,
    color: colors.darkGrey
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
});
