'use client';

import {useCallback, useEffect, useState} from 'react';
import Button from '../../../../../../../../client/src/lib/components/Buttons/Button';
import {SessionControlsState} from '../page';
import ContentControls from '../../../../../../../../client/src/lib/session/components/ContentControls/ContentControls';
import Gutters from '@/lib/components/Gutters';
import {
  Spacer16,
  Spacer32,
  Spacer48,
} from '../../../../../../../../client/src/lib/components/Spacers/Spacer';
import Title from '../../components/Title';
import useResolveHostNotes from '../../../../../../../../client/src/lib/session/hooks/useResolveHostNotes';
import Markdown from '../../../../../../../../client/src/lib/components/Typography/Markdown/Markdown';
import styled from 'styled-components';
import BottomFade from '../../../../../../../../client/src/lib/components/BottomFade/BottomFade';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const Notes = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
});

const Scrollable = styled(Gutters)({
  flex: 1,
  overflow: 'scroll',
});

export default function ExerciseHostNotes() {
  const [state, setState] = useState<SessionControlsState>({
    sessionState: null,
    slideState: null,
    exercise: null,
    currentContentReachedEnd: true,
  });

  const hostNotes = useResolveHostNotes(
    !state.sessionState?.started,
    state.sessionState?.ended,
    state.exercise,
    state.slideState,
  );

  const startSession = useCallback(() => {
    window.opener?.postMessage({
      type: 'sessionControls',
      payload: {type: 'startSession'},
    });
  }, []);

  const previousSlide = useCallback(() => {
    window.opener?.postMessage({
      type: 'sessionControls',
      payload: {type: 'previousSlide'},
    });
  }, []);

  const nextSlide = useCallback(() => {
    window.opener?.postMessage({
      type: 'sessionControls',
      payload: {type: 'nextSlide'},
    });
  }, []);

  const togglePlaying = useCallback(() => {
    window.opener?.postMessage({
      type: 'sessionControls',
      payload: {type: 'togglePlaying'},
    });
  }, []);

  const resetPlaying = useCallback(() => {
    window.opener?.postMessage({
      type: 'sessionControls',
      payload: {type: 'resetPlaying'},
    });
  }, []);

  const receiveMessage = useCallback(({data}: MessageEvent) => {
    if (data.type === 'sessionState') {
      setState(data.payload);
    }
  }, []);

  useEffect(() => {
    window?.opener?.addEventListener('message', receiveMessage);
    window?.opener?.postMessage({
      type: 'sessionControls',
      payload: {type: 'init'},
    });
    return () => window.opener?.removeEventListener('message', receiveMessage);
  }, [receiveMessage]);

  if (typeof window == 'undefined' || !window.opener || !state.exercise)
    return null;

  return (
    <Wrapper>
      <Gutters>
        <Spacer16 />
        <Title />
      </Gutters>
      <Notes>
        <Scrollable>
          <Spacer32 />
          {hostNotes?.map(({text}, i) => (
            <Markdown key={i}>{text}</Markdown>
          ))}
          <Spacer48 />
        </Scrollable>
        <BottomFade color={COLORS.PURE_WHITE} />
      </Notes>
      <Gutters>
        <Spacer16 />
        {!state.sessionState?.started && (
          <>
            <Button onPress={startSession}>Start session</Button>
            <Spacer16 />
          </>
        )}
        {Boolean(
          state.slideState &&
            !state.slideState?.next &&
            !state.sessionState?.ended,
        ) && (
          <>
            <Button onPress={nextSlide}>End session</Button>
            <Spacer16 />
          </>
        )}
        {state.sessionState?.started && !state.sessionState.ended && (
          <>
            <ContentControls
              isHost
              isConnected
              currentContentReachedEnd={state.currentContentReachedEnd}
              sessionState={state.sessionState}
              slideState={state.slideState}
              exercise={state.exercise}
              onPrevPress={previousSlide}
              onNextPress={nextSlide}
              onTogglePlayingPress={togglePlaying}
              onResetPlayingPress={resetPlaying}
            />
            <Spacer32 />
          </>
        )}
      </Gutters>
    </Wrapper>
  );
}
