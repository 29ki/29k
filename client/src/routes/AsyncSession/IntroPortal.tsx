import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import {BottomSafeArea, Spacer16} from '../../lib/components/Spacers/Spacer';
import {
  AsyncSessionStackProps,
  ModalStackProps,
  TabNavigatorProps,
} from '../../lib/navigation/constants/routes';
import {SPACINGS} from '../../lib/constants/spacings';
import useSessionState from '../../lib/session/state/state';
import useLeaveSession from '../../lib/session/hooks/useLeaveSession';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import HostNotes from '../../lib/session/components/HostNotes/HostNotes';
import Screen from '../../lib/components/Screen/Screen';
import IconButton from '../../lib/components/Buttons/IconButton/IconButton';
import {ArrowLeftIcon} from '../../lib/components/Icons';
import AudioFader from '../../lib/session/components/AudioFader/AudioFader';
import {VideoTransition} from '../../lib/session/components/VideoTransition/VideoTransition';
import useUpdateAsyncSessionState from '../../lib/session/hooks/useUpdateAsyncSessionState';
import useExerciseById from '../../lib/content/hooks/useExerciseById';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'space-between',
  zIndex: 1,
});
const Content = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});

const TopBar = styled(Gutters)({
  justifyContent: 'space-between',
  flexDirection: 'row',
});

const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.SIXTEEN,
});

const IntroPortal: React.FC = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'IntroPortal'>>();
  const {t} = useTranslation('Screen.Portal');

  const [isReadyForDisplay, setIsReadyForDisplay] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sessionState = useSessionState(state => state.sessionState);
  const exercise = useExerciseById(session.contentId);

  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<
        AsyncSessionStackProps & TabNavigatorProps & ModalStackProps
      >
    >();
  const {startSession} = useUpdateAsyncSessionState(session);
  const {leaveSessionWithConfirm} = useLeaveSession();
  const isFocused = useIsFocused();

  const introPortal = exercise?.introPortal;
  const textColor = exercise?.theme?.textColor;

  usePreventGoingBack(leaveSessionWithConfirm);

  const navigateToSession = useCallback(
    () => navigate('Session', {session}),
    [navigate, session],
  );

  useEffect(() => {
    if (!introPortal?.videoLoop?.source) {
      // If no video is defined, navigate directly
      navigateToSession();
    }
  }, [introPortal?.videoLoop?.source, navigateToSession]);

  const onStartPress = useCallback(() => {
    startSession();
    // if (sessionState?.id) {
    //   logSessionMetricEvent('Start Sharing Session');
    // }
  }, [startSession]);

  const onVideoReadyForDisplay = useCallback(() => {
    setIsReadyForDisplay(true);
  }, [setIsReadyForDisplay]);

  const onVideoTransition = useCallback(() => {
    setIsTransitioning(true);
    ReactNativeHapticFeedback.trigger('impactHeavy');
  }, [setIsTransitioning]);

  const onVideoEnd = useCallback(() => {
    navigateToSession();
  }, [navigateToSession]);

  return (
    <Screen>
      {isFocused && introPortal?.videoLoop?.audio && (
        <AudioFader
          source={introPortal?.videoLoop?.audio}
          paused={!isReadyForDisplay}
          volume={isTransitioning ? 0 : 1}
          duration={isTransitioning ? 5000 : 10000}
          repeat
        />
      )}
      <VideoTransition
        loopSource={introPortal?.videoLoop?.source}
        loopPosterSource={introPortal?.videoLoop?.preview}
        endSource={introPortal?.videoEnd?.source}
        loop={!sessionState?.started}
        paused={!isFocused}
        onReadyForDisplay={onVideoReadyForDisplay}
        onTransition={onVideoTransition}
        onEnd={onVideoEnd}
      />
      <HostNotes introPortal exercise={exercise} />
      <Spacer16 />
      <Wrapper>
        {isFocused && (
          <Content>
            <TopBar>
              <BackButton
                onPress={leaveSessionWithConfirm}
                fill={textColor}
                Icon={ArrowLeftIcon}
                noBackground
              />
              {__DEV__ && sessionState?.started && (
                <Button small onPress={navigateToSession}>
                  {t('skipPortal')}
                </Button>
              )}
              <Button
                small
                disabled={sessionState?.started}
                onPress={onStartPress}>
                {sessionState?.started
                  ? t('sessionStarted')
                  : t('startSession')}
              </Button>
            </TopBar>
          </Content>
        )}
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default IntroPortal;
