import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import Spacing from './spacing';

interface HeadingProps {
  text: string;
  lineWidth?: number;
}

export const Heading: React.FC<HeadingProps> = ({text, lineWidth}) => (
  <>
    <Text style={styles.heading}>{text}</Text>
    <View style={[styles.line, !!lineWidth && {width: lineWidth}]} />
    <Spacing s={16} />
  </>
);

const styles = StyleSheet.create({
  heading: {
    paddingBottom: 8
  },
  line: {
    height: 6,
    flexDirection: 'row'
  }
});
