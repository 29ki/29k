'use client';

import {useCallback, useEffect, useMemo} from 'react';
import {Metrics, SafeAreaProvider} from 'react-native-safe-area-context';
import useSessionState from '../../../../../../client/src/lib/session/state/state';
import useExerciseById from '../../../../../../client/src/lib/content/hooks/useExerciseById';
import {
  AsyncSessionType,
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/schemas/Session';
import dayjs from 'dayjs';
import {LANGUAGE_TAG} from '../../../../../../shared/src/i18n/constants';
import useAsyncSessionSlideState from '../../../../../../client/src/lib/session/hooks/useAsyncSessionSlideState';
import ContentControls from '../../../../../../client/src/lib/session/components/ContentControls/ContentControls';
import useUpdateAsyncSessionState from '../../../../../../client/src/lib/session/hooks/useUpdateAsyncSessionState';
import Fade from '../../../../../../client/src/lib/components/Fade/Fade';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer40,
  Spacer60,
} from '../../../../../../client/src/lib/components/Spacers/Spacer';
import Gutters from '../../../../../../client/src/lib/components/Gutters/Gutters';
import {useRouter} from 'next/navigation';
import Wrapper from './components/Wrapper';
import Title from './components/Title';
import ProgressBar from '../../../../../../client/src/lib/session/components/ProgressBar/ProgressBar';
import styled from 'styled-components';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import hexToRgba from 'hex-to-rgba';
import NoSsr from '@/lib/components/NoSsr';
import OutroPortal from '../../../../../../client/src/lib/session/components/OutroPortal/OutroPortal';
import ExerciseSlides from '../../../../../../client/src/lib/session/components/ExerciseSlides/ExerciseSlides';
import IntroPortal from '../../../../../../client/src/lib/session/components/IntroPortal/IntroPortal';

const initialWindowMetrics: Metrics | null = {
  frame: {x: 0, y: 0, width: 0, height: 0},
  insets: {top: 0, left: 0, right: 0, bottom: 0},
};

const DesktopOnly = styled.div({
  display: 'none',
  '@media(min-width: 720px)': {
    display: 'block',
  },
});

const LeftGradient = styled.div<{color?: string}>(({color}) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 200,
  background: `linear-gradient(90deg, ${hexToRgba(
    color || COLORS.WHITE,
    1,
  )} 0%, ${hexToRgba(color || COLORS.WHITE, 0.25)} 50%, ${hexToRgba(
    color || COLORS.WHITE,
    0,
  )} 100%)`,
}));

const RightGradient = styled.div<{color?: string}>(({color}) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  width: 200,
  background: `linear-gradient(-90deg, ${hexToRgba(
    color || COLORS.WHITE,
    1,
  )} 0%, ${hexToRgba(color || COLORS.WHITE, 0.25)} 50%, ${hexToRgba(
    color || COLORS.WHITE,
    0,
  )} 100%)`,
}));

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
  const currentContentReachedEnd = useSessionState(
    state => state.currentContentReachedEnd,
  );
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
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('../');
    }
  }, [router]);

  const onNavigateToSession = useCallback(() => {}, []);

  const onPrevPress = useCallback(() => {
    if (sessionSlideState && sessionSlideState.previous) {
      navigateToIndex({
        index: sessionSlideState.index - 1,
        content: sessionSlideState.slides,
      });
    } else {
      router.push('../');
    }
  }, [sessionSlideState, navigateToIndex, router]);

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
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NoSsr>
        {Boolean(sessionState?.ended) && (
          <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
            <Spacer32 />
            <OutroPortal exercise={exercise} onLeaveSession={onLeaveSession} />
            <DesktopOnly>
              <LeftGradient color={exercise?.theme?.backgroundColor} />
              <RightGradient color={exercise?.theme?.backgroundColor} />
            </DesktopOnly>
          </Wrapper>
        )}
        <Fade
          visible={Boolean(sessionState?.started && !sessionState?.ended)}
          duration={2000}>
          {sessionSlideState !== null && (
            <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
              <Gutters>
                <DesktopOnly>
                  <Spacer40 />
                  <Title exercise={exercise} />
                </DesktopOnly>
                <Spacer24 />
                <ProgressBar
                  index={sessionSlideState?.index}
                  length={sessionSlideState?.slides.length}
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
                  currentContentReachedEnd={currentContentReachedEnd}
                  onPrevPress={onPrevPress}
                  onNextPress={onNextPress}
                />
                <Spacer32 />
              </Gutters>
              <ExerciseSlides
                index={sessionSlideState.index}
                current={sessionSlideState.current}
                previous={sessionSlideState.previous}
                next={sessionSlideState.next}
                async
                web
              />
              <Spacer60 />
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
            showMuteToggle
          />
          <DesktopOnly>
            <LeftGradient color={exercise?.theme?.backgroundColor} />
            <RightGradient color={exercise?.theme?.backgroundColor} />
          </DesktopOnly>
        </Wrapper>
      </NoSsr>
    </SafeAreaProvider>
  );
}
