import React, {useEffect, useCallback} from 'react';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {AsyncSessionStackProps} from '../../../lib/navigation/constants/routes';

import useSessionState from '../../../lib/session/state/state';
import useAsyncSessionSlideState from '../../../lib/session/hooks/useAsyncSessionSlideState';
import useAsyncSessionMetricEvents from '../../../lib/session/hooks/useAsyncSessionMetricEvents';
import useAddUserEvent from '../../../lib/user/hooks/useAddUserEvent';

import {
  BottomSafeArea,
  Spacer16,
  Spacer8,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';

import ExerciseSlides from '../../../lib/session/components/ExerciseSlides/ExerciseSlides';
import ContentControls from '../../../lib/session/components/ContentControls/ContentControls';
import Screen from '../../../lib/components/Screen/Screen';
import useUpdateAsyncSessionState from '../../../lib/session/hooks/useUpdateAsyncSessionState';
import Gutters from '../../../lib/components/Gutters/Gutters';
import ProgressBar from '../../../lib/session/components/ProgressBar/ProgressBar';
import useLeaveSession from '../../../lib/session/hooks/useLeaveSession';
import usePreventScreenSleep from '../../../lib/session/hooks/usePreventScreenSleep';

const Spotlight = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
});

const ProgressWrapper = styled.View({
  flexDirection: 'row',
  elevation: 2,
});

const Progress = styled(ProgressBar)({
  flex: 1,
});

const Top = styled.View({});

const Session: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'Session'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AsyncSessionStackProps>>();

  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const {endSession} = useUpdateAsyncSessionState(session);
  const sessionState = useSessionState(state => state.sessionState);
  const currentContentReachedEnd = useSessionState(
    state => state.currentContentReachedEnd,
  );
  const exercise = useSessionState(state => state.exercise);
  const sessionSlideState = useAsyncSessionSlideState();
  const theme = exercise?.theme;
  const logSessionMetricEvent = useAsyncSessionMetricEvents();
  const addUserEvent = useAddUserEvent();
  const {navigateToIndex} = useUpdateAsyncSessionState(session);
  usePreventScreenSleep('session');

  useEffect(() => {
    if (sessionState?.id) {
      logSessionMetricEvent('Enter Sharing Session');
    }
  }, [logSessionMetricEvent, sessionState?.id]);

  useEffect(() => {
    if (sessionState?.completed && exercise?.id) {
      addUserEvent('completedSession', {
        id: sessionState?.id,
        exerciseId: exercise?.id,
        language: session.language,
        type: session.type,
        mode: session.mode,
      });
      logSessionMetricEvent('Complete Sharing Session');
    }
  }, [
    sessionState?.completed,
    sessionState?.id,
    exercise?.id,
    session.language,
    session.type,
    session.mode,
    logSessionMetricEvent,
    addUserEvent,
  ]);

  useEffect(() => {
    if (sessionState?.ended) {
      navigate('OutroPortal', {session});
    }
  }, [sessionState?.ended, navigate, session]);

  const onPrevPress = useCallback(() => {
    if (sessionSlideState && sessionSlideState.previous) {
      navigateToIndex({
        index: sessionSlideState.index - 1,
        content: sessionSlideState.slides,
      });
    } else {
      leaveSessionWithConfirm();
    }
  }, [sessionSlideState, navigateToIndex, leaveSessionWithConfirm]);

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
    <Screen backgroundColor={theme?.backgroundColor}>
      <Top>
        <TopSafeArea />
        <Gutters>
          <Spacer8 />
          <ProgressWrapper>
            <Progress
              index={sessionSlideState?.index}
              length={sessionSlideState?.slides.length}
              color={theme?.textColor}
            />
          </ProgressWrapper>
          <Spacer16 />
          <ContentControls
            async
            exercise={exercise}
            isHost
            sessionState={sessionState}
            slideState={sessionSlideState}
            currentContentReachedEnd={currentContentReachedEnd}
            onPrevPress={onPrevPress}
            onNextPress={onNextPress}
          />
          <Spacer8 />
        </Gutters>
      </Top>

      <Spotlight>
        {sessionSlideState && (
          <>
            <ExerciseSlides
              index={sessionSlideState.index}
              current={sessionSlideState.current}
              previous={sessionSlideState.previous}
              next={sessionSlideState.next}
              async
            />
          </>
        )}
      </Spotlight>
      <Spacer16 />
      <BottomSafeArea />
    </Screen>
  );
};

export default Session;
