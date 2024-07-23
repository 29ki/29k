import React from 'react';
import styled from 'styled-components/native';
import {Platform, ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';

const Image = styled.Image.attrs({
  source: {
    uri: Platform.select({
      android: 'gem',
      default: 'gem.gif',
    }),
  },
})({
  position: 'absolute',
  width: 18,
  height: 18,
  transform: 'scale(1.6)',
  zIndex: 1,
});

const ImageContainer = styled(Animated.View)({
  width: 18,
  height: 18,
});

type GemProps = {
  style?: ViewStyle;
};
const Gem = ({style}: GemProps) => (
  <ImageContainer style={style}>
    <Image />
  </ImageContainer>
);

export default Gem;
