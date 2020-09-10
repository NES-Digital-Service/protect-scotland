import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import M from 'react-native-easy-markdown';

import {text, colors} from '../../theme';

interface Markdown {
  style?: object;
  markdownStyles?: object;
}

const Markdown: React.FC<Markdown> = ({
  style,
  markdownStyles = {},
  children
}) => {
  const combinedStyles = {
    ...localMarkdownStyles,
    ...markdownStyles
  };

  return (
    <M
      markdownStyles={combinedStyles}
      style={style}
      renderListBullet={(ordered: boolean, index: number) =>
        ordered ? (
          <Text
            style={[
              localMarkdownStyles.listItemNumber,
              combinedStyles.listItemNumber
            ]}>
            {index + 1}.
          </Text>
        ) : (
          <View
            style={[
              localMarkdownStyles.listItemBullet,
              combinedStyles.listItemBullet
            ]}
          />
        )
      }>
      {children}
    </M>
  );
};

const localMarkdownStyles = StyleSheet.create({
  text: {
    ...text.default
  },
  strong: {
    fontFamily: text.fontFamily.robotoBold
  },
  link: {
    fontFamily: text.fontFamily.robotoBold,
    color: colors.primaryPurple
  },
  block: {
    marginBottom: 8
  },
  listItemNumber: {
    ...text.default,
    alignSelf: 'flex-start',
    marginRight: 10
  },
  listItemBullet: {
    alignSelf: 'flex-start',
    width: 4,
    height: 4,
    backgroundColor: colors.darkGrey,
    borderRadius: 2,
    marginRight: 10,
    marginTop: 12
  }
});

export default Markdown;
