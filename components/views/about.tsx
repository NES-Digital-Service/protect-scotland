import React, {FC} from 'react';
import {ScrollView, View, Image, StyleSheet, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';

import Container from '../atoms/container';
import Text from '../atoms/text';
import {ModalHeader} from '../molecules/modal-header';
import Spacing from '../atoms/spacing';
import {text, colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import Markdown from '../atoms/markdown';
import {ArrowLink} from '../molecules/arrow-link';
import ActionCard from '../molecules/action-card';
import {useSettings} from '../../providers/settings';

const CommentIcon = require('../../assets/images/icon-comment-pink/icon-comment-pink.png');
const AboutIllustration = require('../../assets/images/about-illustration/image.png');
const IconBell = require('../../assets/images/icon-bell-pink/icon-bell-pink.png');
const IconEye = require('../../assets/images/icon-eye-pink/icon-eye-pink.png');
const IconKey = require('../../assets/images/icon-key-pink/icon-key-pink.png');
const IconJar = require('../../assets/images/icon-jar-pink/icon-jar-pink.png');

export const About: FC = () => {
  const {t} = useTranslation();
  const {traceConfiguration} = useSettings();

  return (
    <ScrollView style={styles.container}>
      <ModalHeader icon={CommentIcon} heading="about:heading" color="pink" />
      <Spacing s={34} />
      <Container center="horizontal" stretch={false}>
        <Image
          source={AboutIllustration}
          accessibilityIgnoresInvertColors={false}
        />
      </Container>
      <Spacing s={43} />
      <Text variant="h1" color="pink">
        {t('about:subheading')}
      </Text>
      <Spacing s={43} />
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconJar} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('about:yourData:textUnion')}
            </Markdown>
          </View>
        </View>
        <Spacing s={24} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconBell} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('about:yourData:textBell')}
            </Markdown>
          </View>
        </View>

        <Spacing s={30} />
        <Text variant="h1" color="pink" maxFontSizeMultiplier={3}>
          {t('about:privacy:title')}
        </Text>
        <Spacing s={34} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconKey} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('about:privacy:textKey', {
                tracePeriod: traceConfiguration.storeExposuresFor
              })}
            </Markdown>
            <Markdown markdownStyles={markdownStyles}>
              {t('about:privacy:textKey1')}
            </Markdown>
            <Spacing s={5} />
            <ArrowLink
              externalLink={t('links:a')}
              accessibilityHint={t('about:privacy:scamsLinkHint')}>
              <Text variant="h4" color="primaryPurple">
                {t('about:privacy:scamsLink')}
              </Text>
            </ArrowLink>
            <Spacing s={30} />
            <ArrowLink
              externalLink={t('links:m')}
              accessibilityHint={t('about:privacy:privacyLinkHint')}
              fullWidth>
              <Text variant="h4" color="primaryPurple">
                {t('about:privacy:privacyLink')}
              </Text>
            </ArrowLink>
          </View>
        </View>
        <Spacing s={60} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconEye} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('about:privacy:textEye')}
            </Markdown>
          </View>
        </View>
      </View>
      <Spacing s={30} />
      <Text variant="h1" color="pink" maxFontSizeMultiplier={3}>
        {t('about:whyUse:title')}
      </Text>
      <Spacing s={24} />
      <Text variant="leader" maxFontSizeMultiplier={3}>
        {t('about:whyUse:main')}
      </Text>
      <Spacing s={24} />
      <Markdown markdownStyles={markdownStyles}>
        {t('about:whyUse:text')}
      </Markdown>
      <ActionCard content={t('about:link')} link={t('links:f')} />
      <Spacing s={110} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  iconWrapper: {
    width: 80,
    paddingTop: 7
  }
});

const markdownStyles = StyleSheet.create({
  h1: {
    lineHeight: 20
  },
  link: {
    ...text.defaultBold,
    color: colors.primaryPurple,
    textDecorationLine: 'underline',
    textDecorationColor: colors.primaryPurple
  }
});
