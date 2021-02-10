import React, {ReactNode} from 'react';
import {Text, StyleSheet, Linking, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import M from 'react-native-easy-markdown';

import Button from './button';
import {text, colors, scale} from '../../theme';
import {useApplication} from '../../providers/context';
import {openBrowserAsync} from '../../utils/web-browser';

interface Markdown {
  style?: object;
  markdownStyles?: object;
  renderLink?: RenderLink;
  accessibleLink?: string;
  customLinks?: boolean;
}

export type RenderLink = (
  href: string,
  title: string,
  children: ReactNode,
  key: string
) => React.ReactNode;

const MarkdownLink = (
  href: string,
  title: string,
  children: any,
  key: string,
  navigation: any,
  screenReaderEnabled: boolean,
  hasAccessibleLink: boolean
) => {
  const isHttp = href.startsWith('http');
  const isTel = href.startsWith('tel');

  // Markdown titles like [text](http://site.com "Title here") will be overridden by default accessibility labels

  if (isHttp || isTel) {
    const handle = isTel
      ? () => {
          const crossPlatformTarget = href.replace(/:(?=\d|\+)/, '://');
          Linking.openURL(crossPlatformTarget);
        }
      : () => openBrowserAsync(href);

    return screenReaderEnabled && !hasAccessibleLink ? (
      // we can't use TouchableWithoutFeedback because is not selectable by keyboard tab navigation
      <TouchableOpacity
        key={key}
        activeOpacity={1}
        accessible={true}
        accessibilityRole="link"
        accessibilityHint={title}
        accessibilityLabel={childrenAsText(children)}
        onPress={handle}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ) : (
      <Text
        key={key}
        accessible={true}
        accessibilityRole="link"
        accessibilityHint={title}
        onPress={handle}>
        {children}
      </Text>
    );
  }

  return (
    <Button type="link" onPress={() => navigation.navigate(href)} label={title}>
      {children}
    </Button>
  );
};

const Markdown: React.FC<Markdown> = ({
  style,
  markdownStyles = {},
  renderLink,
  children,
  accessibleLink,
  customLinks = true
}) => {
  const navigation = useNavigation();

  const {
    accessibility: {screenReaderEnabled}
  } = useApplication();

  const defaultRenderLink: RenderLink = (href, title, node, key) =>
    MarkdownLink(
      href,
      title,
      node,
      key,
      navigation,
      screenReaderEnabled,
      !!accessibleLink
    );

  const combinedStyles = {
    ...localMarkdownStyles,
    ...markdownStyles
  };

  const handleBlockPress = () => {
    Linking.openURL(accessibleLink!);
  };

  const Content: React.FC = () => (
    <M
      markdownStyles={combinedStyles}
      style={style}
      renderLink={customLinks ? renderLink || defaultRenderLink : undefined}
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
  return accessibleLink ? (
    <TouchableOpacity onPress={handleBlockPress} activeOpacity={1}>
      <Content />
    </TouchableOpacity>
  ) : (
    <Content />
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
    marginBottom: scale(24)
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

export const childrenAsText = (
  children: React.ReactChildren | React.ReactNode | undefined,
  joiner = ''
): string =>
  children
    ? (React.Children.toArray(children).reduce(
        (str, child) =>
          `${str}${joiner}${
            React.isValidElement(child)
              ? childrenAsText(child.props.children, joiner)
              : `${child}`
          }`,
        ''
      ) as string)
    : '';

export default Markdown;
