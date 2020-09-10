import React, {FC} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StackNavigationProp} from '@react-navigation/stack';

import {ModalHeader} from '../molecules/modal-header';
import Spacing from '../atoms/spacing';
import {text, colors} from '../../theme';
import Markdown from '../atoms/markdown';
import {NoteLink} from '../atoms/note-link';
import {ArrowLink} from '../molecules/arrow-link';
import {useSettings} from '../../providers/settings';
import {ScreenNames} from '../../navigation';

const CommentIcon = require('../../assets/images/icon-comment-pink/icon-comment-pink.png');
const AboutIllustration = require('../../assets/images/about-illustration/image.png');
const IconBell = require('../../assets/images/icon-bell-pink/icon-bell-pink.png');
const IconEye = require('../../assets/images/icon-eye-pink/icon-eye-pink.png');
const IconKey = require('../../assets/images/icon-key-pink/icon-key-pink.png');
const IconJar = require('../../assets/images/icon-jar-pink/icon-jar-pink.png');

interface AboutProps {
  navigation: StackNavigationProp<any>;
}

export const About: FC<AboutProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {solutionText, traceConfiguration} = useSettings();

  return (
    <ScrollView style={styles.container}>
      <ModalHeader
        icon={CommentIcon}
        heading="about:heading"
        color={colors.pink}
      />
      <Spacing s={34} />
      <View style={styles.center}>
        <Image
          source={AboutIllustration}
          accessible
          accessibilityHint={t('about:illustrationLabel')}
          accessibilityIgnoresInvertColors={false}
        />
      </View>
      <Spacing s={43} />
      <Text style={styles.subheading}>{t('about:subheading')}</Text>
      <Spacing s={43} />
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconJar} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:yourData:view:textUnion')}
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
              {t('onboarding:yourData:view:textBell')}
            </Markdown>
          </View>
        </View>

        <Spacing s={30} />
        <Text style={styles.subheading} maxFontSizeMultiplier={3}>
          {t('onboarding:privacy:view:title')}
        </Text>
        <Spacing s={34} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconKey} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:privacy:view:textKey', {
                tracePeriod: traceConfiguration.storeExposuresFor
              })}
            </Markdown>
            <ArrowLink
              externalLink={t('links:a')}
              accessibilityHint={t('onboarding:privacy:view:scamsLinkHint')}
              accessibilityLabel={t('onboarding:privacy:view:scamsLink')}
              textStyle={styles.link}
            />
            <ArrowLink
              screen={ScreenNames.dataPolicy}
              navigation={navigation}
              accessibilityHint={t('onboarding:privacy:view:privacyLinkHint')}
              accessibilityLabel={t('onboarding:privacy:view:privacyLink')}
              textStyle={styles.link}
            />
            <Spacing s={10} />
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:privacy:view:textKey1', {solutionText})}
            </Markdown>
          </View>
        </View>
        <Spacing s={24} />
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Image source={IconEye} accessibilityIgnoresInvertColors={false} />
          </View>
          <View style={styles.column}>
            <Markdown markdownStyles={markdownStyles}>
              {t('onboarding:privacy:view:textEye')}
            </Markdown>
          </View>
        </View>
      </View>
      <Spacing s={30} />
      <Text style={styles.subheading} maxFontSizeMultiplier={3}>
        {t('onboarding:whyUse:view:title')}
      </Text>
      <Spacing s={24} />
      <Text style={styles.text} maxFontSizeMultiplier={3}>
        {t('onboarding:whyUse:view:main')}
      </Text>
      <Spacing s={24} />
      <Markdown markdownStyles={markdownStyles}>
        {t('onboarding:whyUse:view:text')}
      </Markdown>
      <Spacing s={37} />
      <NoteLink link="links:f" text="about:link" />
      <Spacing s={37} />
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
  center: {
    flex: 1,
    alignItems: 'center'
  },
  subheading: {
    ...text.h1Heading,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    color: colors.pink
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
  divider: {
    borderBottomColor: colors.darkGrey,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    height: 1,
    width: '100%'
  },
  iconWrapper: {
    width: 80,
    paddingLeft: 15,
    paddingTop: 7
  },
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    width: '100%'
  },
  body: {
    ...text.default,
    textAlign: 'center'
  },
  status: {
    ...text.default,
    marginRight: 5
  },
  text: {
    ...text.leader
  },
  link: {
    ...text.h3Heading,
    paddingVertical: 15
  }
});

const markdownStyles = StyleSheet.create({
  h1: {
    lineHeight: 20
  }
});
