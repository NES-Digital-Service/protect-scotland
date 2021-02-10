import React, {FC} from 'react';
import {StyleSheet, View, Animated, PixelRatio} from 'react-native';
import {
  useExposure,
  StatusState
} from 'react-native-exposure-notification-service';

import {colors} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {Tile} from './tile';
import Spacing from '../atoms/spacing';
import {ScreenNames} from '../../navigation';
import {useReminder} from '../../providers/reminder';
import {useSettings} from '../../providers/settings';
import {hasCurrentExposure} from '../../utils/exposure';

const TracingIcon = require('../../assets/images/tracing/image.png');
const InactiveTracingIcon = require('../../assets/images/tracing-inactive/image.png');
const ContactTracingIcon = require('../../assets/images/tracing-contact/image.png');
const CommentIcon = require('../../assets/images/icon-comment/image.png');
const CommunityIcon = require('../../assets/images/icon-community-white/image.png');
const JarIcon = require('../../assets/images/icon-jar/image.png');
const PausedIcon = require('../../assets/images/grid-paused/image.png');

interface Grid {
  onboarded: boolean;
  stage: number;
  opacity: Animated.Value;
  onboardingCallback?: () => void;
}

export const Grid: FC<Grid> = ({
  onboarded,
  stage,
  opacity,
  onboardingCallback
}) => {
  const {contacts, enabled, status} = useExposure();
  const {paused} = useReminder();
  const {isolationDuration} = useSettings();
  const hasContact = hasCurrentExposure(isolationDuration, contacts);
  const active = enabled && status.state === StatusState.active;
  const fontScale = PixelRatio.getFontScale();

  const tracingIcon = hasContact
    ? ContactTracingIcon
    : paused
    ? PausedIcon
    : active
    ? TracingIcon
    : InactiveTracingIcon;

  const tracingLabel = hasContact
    ? 'dashboard:tracing:contact'
    : paused
    ? 'dashboard:tracing:paused'
    : 'dashboard:tracing:label';

  const tracingHint = hasContact
    ? 'dashboard:tracing:contactHint'
    : paused
    ? 'dashboard:tracing:pausedHint'
    : active
    ? 'dashboard:tracing:active'
    : 'dashboard:tracing:inactive';

  const tracingBackground = hasContact
    ? colors.errorRed
    : paused
    ? colors.lightGray
    : active
    ? colors.validationGreen
    : colors.darkGrey;

  if (!onboarded) {
    return (
      <Animated.View style={[styles.container, {opacity}]}>
        <View style={styles.column}>
          {stage === 0 && (
            <Tile
              backgroundColor={tracingBackground}
              label={tracingLabel}
              hint={tracingHint}
              image={tracingIcon}
              minHeight={195}
              link={ScreenNames.tracing}
              onboardingCallback={onboardingCallback}
            />
          )}
          {stage === 2 && (
            <Tile
              backgroundColor={colors.pink}
              label="dashboard:about:label"
              image={CommentIcon}
              link={ScreenNames.about}
              onboardingCallback={onboardingCallback}
            />
          )}
          {stage === 1 && (
            <Tile
              backgroundColor={colors.lilac}
              label="dashboard:community:label"
              image={CommunityIcon}
              link={ScreenNames.community}
              onboardingCallback={onboardingCallback}
            />
          )}
          {stage === 3 && (
            <Tile
              backgroundColor={colors.resultYellow}
              label="dashboard:test:label"
              hint="dashboard:test:hint"
              dark
              image={JarIcon}
              minHeight={195}
              link={ScreenNames.tests}
              onboardingCallback={onboardingCallback}
            />
          )}
        </View>
        {fontScale <= 1 && (
          <>
            <View style={styles.spacer} />
            <View style={styles.column} />
          </>
        )}
      </Animated.View>
    );
  }

  const Stage1 = () => (
    <Tile
      backgroundColor={tracingBackground}
      label={tracingLabel}
      hint={hasContact ? undefined : tracingHint}
      image={tracingIcon}
      minHeight={195}
      link={ScreenNames.tracing}
      additionalLabel={hasContact ? 'dashboard:tracing:contactHint' : undefined}
    />
  );

  const Stage2 = () => (
    <Tile
      backgroundColor={colors.pink}
      label="dashboard:about:label"
      image={CommentIcon}
      link={ScreenNames.about}
    />
  );

  const Stage3 = () => (
    <Tile
      backgroundColor={colors.lilac}
      label="dashboard:community:label"
      image={CommunityIcon}
      link={ScreenNames.community}
    />
  );

  const Stage4 = () => (
    <Tile
      backgroundColor={colors.resultYellow}
      label="dashboard:test:label"
      hint="dashboard:test:hint"
      dark
      image={JarIcon}
      minHeight={195}
      link={ScreenNames.tests}
    />
  );

  if (fontScale <= 1.6) {
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <Stage1 />
          <Spacing s={15} />
          <Stage2 />
        </View>
        <View style={styles.spacer} />
        <View style={styles.column}>
          <Stage3 />
          <Spacing s={15} />
          <Stage4 />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.largeFontColumn}>
      <Stage1 />
      <Spacing s={15} />
      <Stage2 />
      <Spacing s={15} />
      <Stage3 />
      <Spacing s={15} />
      <Stage4 />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: SPACING_HORIZONTAL
  },
  column: {
    flex: 1,
    flexDirection: 'column'
  },
  largeFontColumn: {
    flexDirection: 'column',
    paddingHorizontal: SPACING_HORIZONTAL
  },
  spacer: {
    width: 15
  }
});
