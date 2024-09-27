'use client';

import {useCallback, useEffect, useMemo} from 'react';
import useSessionState from '../../../../../client/src/lib/session/state/state';
import useExerciseById from '../../../../../client/src/lib/content/hooks/useExerciseById';
import {
  AsyncSessionType,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import dayjs from 'dayjs';
import {LANGUAGE_TAG} from '../../../../../shared/src/i18n/constants';
import useAsyncSessionSlideState from '../../../../../client/src/lib/session/hooks/useAsyncSessionSlideState';
import ExerciseSlides from '../../../../../client/src/lib/session/components/ExerciseSlides/ExerciseSlides';
import ContentControls from '../../../../../client/src/lib/session/components/ContentControls/ContentControls';
import useUpdateAsyncSessionState from '../../../../../client/src/lib/session/hooks/useUpdateAsyncSessionState';
import Fade from '../../../../../client/src/lib/components/Fade/Fade';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer40,
} from '../../../../../client/src/lib/components/Spacers/Spacer';
import Gutters from '../../../../../client/src/lib/components/Gutters/Gutters';
import IntroPortal from '../../../../../client/src/lib/session/components/IntroPortal/IntroPortal';
import {useRouter} from 'next/navigation';
import OutroPortal from '../../../../../client/src/lib/session/components/OutroPortal/OutroPortal';
import Wrapper from './components/Wrapper';
import {Display28} from '../../../../../client/src/lib/components/Typography/Display/Display';
import {LogoIcon} from '../../../../../client/src/lib/components/Icons';
import Title from './components/Title';
import ProgressBar from '../../../../../client/src/lib/session/components/ProgressBar/ProgressBar';

export default function ExercisePage({
  params: {language, exerciseId},
}: {
  params: {language: LANGUAGE_TAG; exerciseId: string};
}) {
  const router = useRouter();
  const setAsyncSession = useSessionState(state => state.setAsyncSession);
  const resetSession = useSessionState(state => state.reset);
  const setExercise = useSessionState(state => state.setExercise);
  const sessionState = useSessionState(state => state.sessionState);
  const exercise = useExerciseById(exerciseId);
  const session = useMemo(
    () =>
      ({
        type: SessionType.public,
        mode: SessionMode.async,
        id: 'wip',
        startTime: dayjs().toISOString(),
        exerciseId: exerciseId,
        language: language,
      } as AsyncSessionType),
    [exerciseId, language],
  );

  const {startSession, navigateToIndex, endSession} =
    useUpdateAsyncSessionState(session);
  const sessionSlideState = useAsyncSessionSlideState();

  useEffect(() => {
    resetSession();
    setAsyncSession(session);
    setExercise(exercise);
  }, [exercise, session, setAsyncSession, setExercise, resetSession]);

  const onLeaveSession = useCallback(() => {
    router.push('../');
  }, [router]);

  const onNavigateToSession = useCallback(() => {}, []);

  const onPrevPress = useCallback(() => {
    if (sessionSlideState && sessionSlideState.previous) {
      navigateToIndex({
        index: sessionSlideState.index - 1,
        content: sessionSlideState.slides,
      });
    } else {
      endSession();
      router.push('../');
    }
  }, [sessionSlideState, navigateToIndex, endSession, router]);

  const onNextPress = useCallback(() => {
    if (sessionSlideState && sessionSlideState.next) {
      navigateToIndex({
        index: sessionSlideState.index + 1,
        content: sessionSlideState.slides,
      });
    } else {
      endSession();
    }
  }, [sessionSlideState, navigateToIndex, endSession]);

  return (
    <>
      {Boolean(sessionState?.ended) && (
        <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
          <OutroPortal exercise={exercise} onLeaveSession={onLeaveSession} />
        </Wrapper>
      )}
      <Fade
        visible={Boolean(sessionState?.started && !sessionState?.ended)}
        duration={2000}>
        {sessionSlideState !== null && (
          <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
            <Gutters>
              <Spacer40 />
              <Title exercise={exercise} />
              <Spacer24 />
              <ProgressBar
                index={sessionSlideState?.index}
                length={exercise?.slides.length}
                color={exercise?.theme?.textColor}
              />
              <Spacer16 />
              <ContentControls
                async
                exercise={exercise}
                isHost
                sessionState={sessionState}
                slideState={sessionSlideState}
                isConnected // No need to disable buttons for async sessions
                currentContentReachedEnd={true}
                onPrevPress={onPrevPress}
                onNextPress={onNextPress}
                style={{zIndex: 1}}
              />
              <Spacer32 />
            </Gutters>
            <ExerciseSlides
              index={sessionSlideState.index}
              current={sessionSlideState.current}
              previous={sessionSlideState.previous}
              next={sessionSlideState.next}
              async
            />
            <Spacer32 />
          </Wrapper>
        )}
      </Fade>
      <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
        <Spacer32 />
        <IntroPortal
          exercise={exercise}
          isVisible={!sessionState?.started}
          isHost={true}
          hideHostNotes={true}
          onStartSession={startSession}
          onLeaveSession={onLeaveSession}
          onNavigateToSession={onNavigateToSession}
        />
      </Wrapper>
    </>
  );
}
