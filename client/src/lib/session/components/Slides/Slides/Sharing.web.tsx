import React from 'react';
import styled from 'styled-components/native';
import {ExerciseSlideSharingSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
});

type Props = {
  slide: ExerciseSlideSharingSlide;
};
const Sharing: React.FC<Props> = ({slide}) => (
  <Container>
    <Heading>{slide.content?.heading}</Heading>
  </Container>
);

export default Sharing;
