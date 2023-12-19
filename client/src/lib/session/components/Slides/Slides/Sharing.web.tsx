import React from 'react';
import styled from 'styled-components/native';
import {HeartIcon} from '../../../../components/Icons';
import useSessionState from '../../../state/state';
import {ExerciseSlideSharingSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
});

const Icon = styled(HeartIcon)({
  width: '33%',
});

type Props = {
  slide: ExerciseSlideSharingSlide;
};
const Sharing: React.FC<Props> = ({slide}) => {
  const theme = useSessionState(state => state.exercise?.theme);
  return (
    <Container>
      <Icon fill={theme?.textColor} />
      <Heading>{slide.content?.heading}</Heading>
    </Container>
  );
};

export default Sharing;
