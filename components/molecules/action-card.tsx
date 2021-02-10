import React, {FC} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Image,
  TouchableWithoutFeedback,
  AccessibilityProps
} from 'react-native';

import Text from '../atoms/text';
import Container from '../atoms/container';
import {text, colors} from '../../theme';
import {openBrowserAsync} from '../../utils/web-browser';

const IconNote = require('../../assets/images/icon-note/image.png');
const IconNoteYellow = require('../../assets/images/icon-note-yellow/image.png');

interface CardProps extends AccessibilityProps {
  style?: ViewStyle;
  content: string;
  link: string;
  inverted?: boolean;
}

const ActionCard: FC<CardProps> = ({
  style,
  content,
  link,
  inverted = false,
  ...props
}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => openBrowserAsync(link)}
      accessibilityRole="link"
      {...props}>
      <View style={[styles.container, style, inverted && styles.inverted]}>
        <View style={[styles.left, inverted && styles.invertedBg]}>
          <Image
            accessibilityIgnoresInvertColors={false}
            source={inverted ? IconNoteYellow : IconNote}
            style={styles.note}
            resizeMethod="resize"
            resizeMode="contain"
          />
        </View>
        <Container>
          <Text variant="small" color="darkGrey" style={styles.text}>
            {content}
          </Text>
        </Container>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  inverted: {
    color: colors.darkGrey,
    borderColor: colors.darkGrey,
    fontFamily: text.fontFamily.latoBold
  },
  invertedBg: {backgroundColor: colors.darkGrey},
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.darkGrey,
    borderRadius: 10
  },
  left: {
    backgroundColor: colors.darkGrey,
    justifyContent: 'center',
    paddingVertical: 31,
    paddingLeft: 30,
    paddingRight: 24,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  },
  note: {
    alignSelf: 'center'
  },
  text: {
    paddingLeft: 20,
    paddingVertical: 20,
    paddingRight: 30
  }
});

export default ActionCard;
