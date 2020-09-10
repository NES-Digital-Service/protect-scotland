import React, {FC} from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {useTranslation} from 'react-i18next';

import {text as T, colors} from '../../theme';

const IconNote = require('../../assets/images/icon-note/image.png');

interface NoteLink {
  text: string;
  link: string;
  background?: string;
}

export const NoteLink: FC<NoteLink> = ({
  background = colors.darkGrey,
  link,
  text
}) => {
  const {t} = useTranslation();
  const handle = () => {
    WebBrowser.openBrowserAsync(t(link), {
      enableBarCollapsing: true,
      showInRecents: true
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handle}>
      <View style={[styles.container, {borderColor: background}]}>
        <View style={[styles.icon, {backgroundColor: background}]}>
          <Image
            source={IconNote}
            width={36}
            height={36}
            resizeMethod="resize"
            resizeMode="contain"
            accessibilityIgnoresInvertColors={false}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text, styles.heading, {color: background}]}>
            {t(text)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    overflow: 'hidden'
  },
  heading: {
    fontWeight: 'bold'
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: 100
  },
  text: {
    ...T.smallerParagraph
  },
  textContainer: {
    flex: 1,
    padding: 13,
    paddingHorizontal: 25
  }
});
