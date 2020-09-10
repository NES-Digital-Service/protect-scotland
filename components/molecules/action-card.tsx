import React, {FC} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Image,
  Text,
  TouchableWithoutFeedback
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import {text, colors} from '../../theme';
const IconNote = require('../../assets/images/icon-note/image.png');
const IconNoteYellow = require('../../assets/images/icon-note-yellow/image.png');

interface CardProps {
  style?: ViewStyle;
  content: string;
  link: string;
  inverted?: boolean;
}

const ActionCard: FC<CardProps> = ({
  style,
  content,
  link,
  inverted = false
}) => {
  const handle = () => {
    WebBrowser.openBrowserAsync(link, {
      enableBarCollapsing: true,
      showInRecents: true
    });
  };
  return (
    <TouchableWithoutFeedback onPress={handle}>
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
        <View style={styles.flex}>
          <Text style={[styles.text, inverted && styles.inverted]}>
            {content}
          </Text>
        </View>
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
  flex: {
    flex: 1
  },
  text: {
    ...text.smallerParagraph,
    paddingLeft: 20,
    paddingVertical: 20,
    paddingRight: 30,
    color: colors.darkGrey,
    fontWeight: 'bold'
  }
});

export default ActionCard;
