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
        source={require('../../../../assets/images/thumbs-up-silouette.png')}
      />
    )}
    <Image source={require('../../../../assets/images/thumbs-up.png')} />
  </Container>
);

export const ThumbsDown = styled(ThumbsUp)({
  transform: 'scaleY(-1)',
});

export const ThumbsUpWithoutPadding: React.FC<Pick<ThumbProps, 'style'>> = ({
  style,
}) => (
  <Container style={style}>
    <Image
      source={require('../../../../assets/images/thumbs-up-without-padding.png')}
    />
  </Container>
);

export const ThumbsDownWithoutPadding = styled(ThumbsUpWithoutPadding)({
  transform: 'scaleY(-1)',
});
