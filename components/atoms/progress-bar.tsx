import React, {useRef, useEffect} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {colors} from '../../theme';

interface ProgressBarProps {
  style?: any;
  sections: number;
  activeSection: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  style,
  sections = 1,
  activeSection = 1
}) => {
  const width = useRef(new Animated.Value((100 / sections) * activeSection))
    .current;
  useEffect(() => {
    const newWidth = (100 / sections) * activeSection;
    Animated.timing(width, {
      toValue: newWidth,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [activeSection, sections, width]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: width.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            })
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.darkPurple,
    borderRadius: 1
  },
  bar: {
    height: 4,
    borderRadius: 1,
    backgroundColor: colors.white
  }
});

export default ProgressBar;
