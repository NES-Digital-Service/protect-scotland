import React, {FC} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import Media from '../atoms/media';
import Text from '../atoms/text';
import Spacing from '../atoms/spacing';
import {ArrowLink} from './arrow-link';
import {colors, scale} from '../../theme';

const Number: FC = ({children}) => (
  <View style={styles.number}>
    <Text bold color="white" align="center" style={styles.numberText}>
      {children}
    </Text>
  </View>
);

interface CloseContactStepProps {
  number: number;
  title: string;
  text?: string | React.ReactNode;
  link?: string;
  linkText?: string;
  onPress?: () => void;
}

const CloseContactStep: FC<CloseContactStepProps> = ({
  number,
  title,
  text,
  link,
  linkText,
  onPress
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View>
      <Media left={<Number>{number}</Number>} leftStyle={styles.left}>
        <Text variant="h4" color="errorRed">
          {title}
        </Text>
        <Spacing s={16} />
        {typeof text === 'string' ? <Text color="darkGrey">{text}</Text> : text}
        {link && (
          <>
            <Spacing s={24} />
            <ArrowLink externalLink={link}>
              <Text variant="h4" color="primaryPurple">
                {linkText}
              </Text>
            </ArrowLink>
          </>
        )}
      </Media>
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  left: {
    marginRight: 16
  },
  number: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.darkGrey
  },
  numberText: {
    fontSize: scale(17)
  }
});

export default CloseContactStep;
