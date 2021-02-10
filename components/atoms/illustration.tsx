import React from 'react';
import {Image, ImageProps, StyleSheet, Dimensions} from 'react-native';

import Container from './container';

const WINDOW_WIDTH = Dimensions.get('window').width;

interface IllustrationProps extends ImageProps {
  fullWidth?: boolean;
}

const Illustration: React.FC<IllustrationProps> = ({
  fullWidth,
  source,
  ...props
}) => {
  const {width: imgWidth, height: imgHeight} = Image.resolveAssetSource(source);

  return (
    <Container stretch={false} center="horizontal">
      <Image
        source={source}
        accessibilityIgnoresInvertColors={false}
        {...props}
        style={
          fullWidth
            ? [
                styles.fullWidth,
                {height: imgHeight * (WINDOW_WIDTH / imgWidth)}
              ]
            : undefined
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  fullWidth: {width: '100%'}
});

export default Illustration;
