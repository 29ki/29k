import * as React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View({
  aspectRatio: '1',
});

const Image = styled.Image({
  position: 'absolute',
  width: '100%',
  height: '100%',
});

type ThumbProps = {
  active?: boolean;
  style?: ViewStyle;
};

export const ThumbsUp: React.FC<ThumbProps> = ({active = false, style}) => (
  <Container style={style}>
    {active && (
      <Image
        source={{
          uri: 'thumbs_up_silouette',
        }}
      />
    )}
    <Image
      source={{
        uri: 'thumbs_up',
      }}
    />
  </Container>
);

export const ThumbsDown = styled(ThumbsUp)({
  transform: 'scaleY(-1)',
});

export const ThumbsUpWithoutPadding = styled(ThumbsUp)({
  transform: 'scale(2)',
});

export const ThumbsDownWithoutPadding = styled(ThumbsUpWithoutPadding)({
  transform: 'scale(2, -2)',
});
