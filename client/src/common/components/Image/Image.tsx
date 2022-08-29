import React from 'react';
import styled from 'styled-components/native';

const ImageStyled = styled.Image({
  width: '100%',
  aspectRatio: '1.35',
  resizeMode: 'cover',
});

type ImageProps = {
  src: string;
};
const Image: React.FC<ImageProps> = ({src}) => (
  <ImageStyled source={{uri: src}} />
);

export default Image;
