import React from 'react';
import {View} from 'react-native';
import {scale} from '../../theme';

const Spacing: React.FC<{s: number}> = ({s}) => (
  <View style={{height: scale(s)}} />
);

export default Spacing;
