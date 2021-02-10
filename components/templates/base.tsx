import React from 'react';
import {StyleSheet} from 'react-native';

import Container from '../atoms/container';
import {colors} from '../../theme';

const Base: React.FC = ({children}) => (
  <Container style={styles.container}>{children}</Container>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryPurple
  }
});

export {Base};
