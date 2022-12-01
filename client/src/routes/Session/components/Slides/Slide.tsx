import React, {useEffect} from 'react';
import styled from 'styled-components/native';

import {ExerciseSlide} from '../../../../../../shared/src/types/Content';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Content from './Slides/Content';

import useExerciseTheme from '../../hooks/useExerciseTheme';
import useSessionParticipantSpotlight from '../../hooks/useSessionParticipantSpotlight';
import Participant from '../Participants/Participant';
import useSessionState from '../../state/state';

type WrapperProps = {backgroundColor?: string};
const Wrapper = styled.View<WrapperProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor: backgroundColor ?? COLORS.WHITE,
}));

type SlideProps = {
  slide: ExerciseSlide;
  active: boolean;
};

export const Slide = React.memo(({slide, active}: SlideProps) => {
  const participantSpotlight = useSessionParticipantSpotlight();
  const theme = useExerciseTheme();

  const setIsLoadingContent = useSessionState(
    state => state.setIsLoadingContent,
  );

  useEffect(() => {
    if (slide.type === 'host' || !slide.content?.video) {
      setIsLoadingContent(false);
    }
  }, [setIsLoadingContent, active, slide]);

  return (
    <Wrapper backgroundColor={theme?.backgroundColor}>
      {slide.type === 'host' && (
        <Participant participant={participantSpotlight} isHostSpotlight />
      )}
      {slide.type === 'content' && <Content slide={slide} active={active} />}
      {slide.type === 'reflection' && <Content slide={slide} active={active} />}
      {slide.type === 'sharing' && <Content slide={slide} active={active} />}
    </Wrapper>
  );
});
