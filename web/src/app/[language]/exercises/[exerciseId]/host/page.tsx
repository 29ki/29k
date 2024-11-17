'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Metrics, SafeAreaProvider} from 'react-native-safe-area-context';
import useSessionState from '../../../../../../../client/src/lib/session/state/state';
import useExerciseById from '../../../../../../../client/src/lib/content/hooks/useExerciseById';
import {
  AsyncSessionType,
  SessionMode,
  SessionStateType,
  SessionType,
} from '../../../../../../../shared/src/schemas/Session';
import dayjs from 'dayjs';
import {LANGUAGE_TAG} from '../../../../../../../shared/src/i18n/constants';
import useUpdateAsyncSessionState from '../../../../../../../client/src/lib/session/hooks/useUpdateAsyncSessionState';
import Fade from '../../../../../../../client/src/lib/components/Fade/Fade';
import {
  Spacer32,
  Spacer60,
} from '../../../../../../../client/src/lib/components/Spacers/Spacer';
import {useRouter, useSearchParams} from 'next/navigation';
import Wrapper from '../components/Wrapper';
import styled from 'styled-components';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import hexToRgba from 'hex-to-rgba';
import dynamic from 'next/dynamic';
import useLiveSessionSlideState, {
  SessionSlideState,
} from '../../../../../../../client/src/lib/session/hooks/useLiveSessionSlideState';
import {ExerciseWithLanguage} from '../../../../../../../client/src/lib/content/types';
import NoSsr from '@/lib/components/NoSsr';
import OutroPortal from '../../../../../../../client/src/lib/session/components/OutroPortal/OutroPortal';
import ExerciseSlides from '../../../../../../../client/src/lib/session/components/ExerciseSlides/ExerciseSlides';
import IntroPortal from '../../../../../../../client/src/lib/session/components/IntroPortal/IntroPortal';
import {useTranslation} from 'react-i18next';

export type SessionControlsState = {
  sessionState: SessionStateType | null;
  slideState: SessionSlideState | null;
  exercise: ExerciseWithLanguage | null;
  currentContentReachedEnd: boolean;
};

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

export default function ExerciseHostPage({
  params: {language, exerciseId},
}: {
  params: {language: LANGUAGE_TAG; exerciseId: string};
}) {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const router = useRouter();
  const {t} = useTranslation('Web.HostExercise');
  const sessionControlsWindowRef = useRef<Window | null>(null);
  const [sessionControlsOpen, setSessionControlsOpen] = useState(false);

  const setAsyncSession = useSessionState(state => state.setAsyncSession);
  const resetSession = useSessionState(state => state.reset);
  const setExercise = useSessionState(state => state.setExercise);
  const currentContentReachedEnd = useSessionState(
    state => state.currentContentReachedEnd,
  );
  const setCurrentContentReachedEnd = useSessionState(
    state => state.setCurrentContentReachedEnd,
  );
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

  const {startSession, navigateToIndex, endSession, setPlaying} =
    useUpdateAsyncSessionState(session);
  const slideState = useLiveSessionSlideState();

  const reset = useCallback(() => {
    setSessionControlsOpen(false);
    resetSession();
    setAsyncSession(session);
    setExercise(exercise);
  }, [exercise, session, setAsyncSession, setExercise, resetSession]);

  const onLeaveSession = useCallback(() => {
    if (returnTo) {
      router.push(returnTo);
    } else if (window.history.length > 2) {
      router.back();
    } else {
      router.push('../../');
    }
  }, [router, returnTo]);

  const onNavigateToSession = useCallback(() => {}, []);

  const onPrevPress = useCallback(() => {
    if (slideState && slideState.previous) {
      navigateToIndex({
        index: slideState.index - 1,
        content: slideState.slides,
      });
    } else {
      resetSession();
    }
  }, [slideState, navigateToIndex, resetSession]);

  const onNextPress = useCallback(() => {
    if (slideState && slideState.next) {
      navigateToIndex({
        index: slideState.index + 1,
        content: slideState.slides,
      });
    } else {
      if (returnTo) {
        router.push(returnTo);
      } else {
        endSession();
      }
    }
  }, [slideState, navigateToIndex, endSession, router, returnTo]);

  const onResetPlayingPress = useCallback(() => {
    setPlaying(Boolean(sessionState?.playing));
    setCurrentContentReachedEnd(false);
  }, [sessionState?.playing, setPlaying, setCurrentContentReachedEnd]);

  const onTogglePlayingPress = useCallback(() => {
    if (currentContentReachedEnd) {
      setPlaying(true);
      setCurrentContentReachedEnd(false);
    } else {
      const playing = !sessionState?.playing;
      setPlaying(playing);
    }
  }, [
    sessionState?.playing,
    setPlaying,
    currentContentReachedEnd,
    setCurrentContentReachedEnd,
  ]);

  const onOpenSessionControls = useCallback(() => {
    sessionControlsWindowRef.current = window.open(
      './controls',
      'sessionControls',
      'popup,width=400,height=600',
    );
    setSessionControlsOpen(true);
  }, []);

  const publishSessionState = useCallback(() => {
    window.postMessage({
      type: 'sessionState',
      payload: {
        sessionState,
        slideState,
        exercise,
        currentContentReachedEnd,
      },
    });
  }, [sessionState, slideState, exercise, currentContentReachedEnd]);

  const onMessage = useCallback(
    ({data}: MessageEvent) => {
      if (data.type === 'sessionControls') {
        const {type} = data.payload;
        switch (type) {
          case 'init':
            publishSessionState();
            break;
          case 'reset':
            reset();
            break;
          case 'startSession':
            startSession();
            break;
          case 'nextSlide':
            onNextPress();
            break;
          case 'previousSlide':
            onPrevPress();
            break;
          case 'togglePlaying':
            onTogglePlayingPress();
            break;
          case 'resetPlaying':
            onResetPlayingPress();
            break;
        }
      }
    },
    [
      publishSessionState,
      reset,
      startSession,
      onNextPress,
      onPrevPress,
      onTogglePlayingPress,
      onResetPlayingPress,
    ],
  );

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onMessage]);

  useEffect(() => {
    publishSessionState();
  }, [publishSessionState]);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NoSsr>
        {Boolean(sessionState?.ended) && (
          <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
            <Spacer32 />
            <OutroPortal exercise={exercise} />
            <DesktopOnly>
              <LeftGradient color={exercise?.theme?.backgroundColor} />
              <RightGradient color={exercise?.theme?.backgroundColor} />
            </DesktopOnly>
          </Wrapper>
        )}
        <Fade
          visible={Boolean(sessionState?.started && !sessionState?.ended)}
          duration={2000}>
          {slideState !== null && (
            <Wrapper backgroundColor={exercise?.theme?.backgroundColor}>
              <Spacer60 />
              <ExerciseSlides
                index={slideState.index}
                current={slideState.current}
                previous={slideState.previous}
                next={slideState.next}
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
            onStartSession={
              !sessionControlsOpen ? onOpenSessionControls : undefined
            }
            onLeaveSession={!sessionControlsOpen ? onLeaveSession : undefined}
            onNavigateToSession={onNavigateToSession}
            showMuteToggle={!sessionControlsOpen}
            startButtonText={t('openHostControls')}
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
