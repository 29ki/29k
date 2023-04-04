import React, {useEffect, useCallback} from 'react';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';

import {AsyncSessionStackProps} from '../../../lib/navigation/constants/routes';

import useSessionState from '../../../lib/session/state/state';
import useSessionSlideState from '../../../lib/session/hooks/useSessionSlideState';
import usePreventGoingBack from '../../../lib/navigation/hooks/usePreventGoingBack';
import useLeaveSession from '../../../lib/session/hooks/useLeaveSession';
import useAsyncSessionMetricEvents from '../../../lib/session/hooks/useAsyncSessionMetricEvents';
import useUserState from '../../../lib/user/state/state';

import {BottomSafeArea, Spacer16} from '../../../lib/components/Spacers/Spacer';

import ExerciseSlides from '../../../lib/session/components/ExerciseSlides/ExerciseSlides';
import ContentControls from '../../../lib/session/components/ContentControls/ContentControls';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';
import {HangUpIcon} from '../../../lib/components/Icons';
import Button from '../../../lib/components/Buttons/Button';
import HostNotes from '../../../lib/session/components/HostNotes/HostNotes';
import Screen from '../../../lib/components/Screen/Screen';
import useUpdateAsyncSessionState from '../../../lib/session/hooks/useUpdateAsyncSessionState';
import Gutters from '../../../lib/components/Gutters/Gutters';

const Spotlight = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const ExerciseControl = styled(ContentControls)({
  position: 'absolute',
  bottom: SPACINGS.SIXTEEN,
  left: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
  zIndex: 1000,
});

const SessionControls = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
});

const Top = styled.View({
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 1000,
});

const StyledButton = styled(Button)({
  alignSelf: 'flex-end',
  marginRight: SPACINGS.SIXTEEN,
});

const StyledHangUpIcon = () => <HangUpIcon fill={COLORS.ACTIVE} />;

const Session: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'Session'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AsyncSessionStackProps>>();
  const {t} = useTranslation('Screen.Session');

  const {endSession} = useUpdateAsyncSessionState(session);
  const sessionState = useSessionState(state => state.sessionState);
  const currentContentReachedEnd = useSessionState(
    state => state.currentContentReachedEnd,
  );
  const setCurrentContentReachedEnd = useSessionState(
    state => state.setCurrentContentReachedEnd,
  );
  const exercise = useSessionState(state => state.exercise);
  const sessionSlideState = useSessionSlideState();
  const theme = exercise?.theme;
  const logSessionMetricEvent = useAsyncSessionMetricEvents();
  const {leaveSessionWithConfirm} = useLeaveSession(session);
  const {addUserEvent} = useUserState();
  const {navigateToIndex, setPlaying} = useUpdateAsyncSessionState(session);

  usePreventGoingBack(leaveSessionWithConfirm);

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
    if (sessionSlideState && exercise?.slides) {
      navigateToIndex({
        index: sessionSlideState.index - 1,
        content: exercise?.slides,
      });
    }
  }, [sessionSlideState, exercise?.slides, navigateToIndex]);

  const onNextPress = useCallback(() => {
    if (sessionSlideState && exercise?.slides) {
      navigateToIndex({
        index: sessionSlideState.index + 1,
        content: exercise?.slides,
      });
    }
  }, [sessionSlideState, exercise?.slides, navigateToIndex]);

  const onResetPlayingPress = useCallback(
    () => setPlaying(Boolean(sessionState?.playing)),
    [sessionState?.playing, setPlaying],
  );

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

  return (
    <Screen backgroundColor={theme?.backgroundColor}>
      <Top>
        {sessionSlideState?.current.type !== 'sharing' && (
          <HostNotes async exercise={exercise} />
        )}
        {!sessionSlideState?.next && (
          <>
            <Spacer16 />
            <StyledButton small active onPress={endSession}>
              {t('endButton')}
            </StyledButton>
          </>
        )}
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
        <ExerciseControl
          async
          exercise={exercise}
          isHost
          sessionState={sessionState}
          slideState={sessionSlideState}
          currentContentReachedEnd={currentContentReachedEnd}
          onPrevPress={onPrevPress}
          onNextPress={onNextPress}
          onResetPlayingPress={onResetPlayingPress}
          onTogglePlayingPress={onTogglePlayingPress}
        />
      </Spotlight>
      <Spacer16 />
      <Gutters>
        <SessionControls>
          <IconButton
            variant="secondary"
            Icon={StyledHangUpIcon}
            fill={COLORS.ACTIVE}
            onPress={leaveSessionWithConfirm}
          />
        </SessionControls>
      </Gutters>
      <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
    </Screen>
  );
};

export default Session;
