import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useIsFocused} from '@react-navigation/native';

import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import useNavigateWithFade from '../../lib/navigation/hooks/useNavigateWithFade';
import useSessionExercise from '../../lib/session//hooks/useSessionExercise';
import useLeaveSession from '../../lib/session/hooks/useLeaveSession';

import {BottomSafeArea, TopSafeArea} from '../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../lib/constants/spacings';
import Screen from '../../lib/components/Screen/Screen';
import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import AudioFader from '../../lib/session/components/AudioFader/AudioFader';
import useSessionState from '../../lib/session/state/state';
import useLogInSessionMetricEvents from '../../lib/session/hooks/useLogInSessionMetricEvents';
import {VideoTransition} from '../../lib/session/components/VideoTransition/VideoTransition';

const TopBar = styled(Gutters)({
  justifyContent: 'flex-end',
  flexDirection: 'row',
});

const OutroPortal: React.FC = () => {
  const {t} = useTranslation('Screen.Portal');

  const [isReadyForDisplay, setIsReadyForDisplay] = useState(false);
  const [isReadyToLeave, setIsReadyToLeave] = useState(false);

  const session = useSessionState(state => state.session);
  const exercise = useSessionExercise();
  const {leaveSession} = useLeaveSession();
  const isFocused = useIsFocused();

  const logSessionMetricEvent = useLogInSessionMetricEvents();

  usePreventGoingBack();
  useNavigateWithFade();

  const outroPortal = exercise?.outroPortal;
  const introPortal = exercise?.introPortal;

  useEffect(() => {
    if (session?.id) {
      logSessionMetricEvent('Enter Outro Portal');
    }
  }, [logSessionMetricEvent, session?.id]);

  useEffect(() => {
    if (
      session?.id &&
      !outroPortal?.video &&
      (!introPortal?.videoEnd || !introPortal?.videoLoop)
    ) {
      leaveSession();
    }
  }, [
    session?.id,
    introPortal?.videoEnd,
    introPortal?.videoLoop,
    outroPortal?.video,
    leaveSession,
  ]);

  const onVideoReadyForDisplay = useCallback(() => {
    setIsReadyForDisplay(true);
  }, [setIsReadyForDisplay]);

  const onVideoTransition = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    setIsReadyToLeave(true);
  };

  return (
    <Screen>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />

      {outroPortal?.video?.source ? (
        <VideoTransition
          endSource={outroPortal.video.source}
          endPosterSource={outroPortal.video?.preview}
          onEnd={onVideoTransition}
        />
      ) : (
        introPortal?.videoEnd?.source &&
        introPortal?.videoLoop?.source && (
          <>
            {isFocused && introPortal?.videoLoop?.audio && (
              <AudioFader
                source={introPortal?.videoLoop.audio}
                repeat
                paused={!isReadyForDisplay}
                volume={isReadyToLeave ? 1 : 0}
                duration={isReadyToLeave ? 20000 : 5000}
              />
            )}
            <VideoTransition
              startSource={introPortal.videoEnd.source}
              loopSource={introPortal.videoLoop.source}
              reverse
              onTransition={onVideoTransition}
              onReadyForDisplay={onVideoReadyForDisplay}
            />
          </>
        )
      )}

      {isReadyToLeave && (
        <TopBar>
          <Button variant="secondary" small onPress={leaveSession}>
            {t('leavePortal')}
          </Button>
        </TopBar>
      )}
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default OutroPortal;
