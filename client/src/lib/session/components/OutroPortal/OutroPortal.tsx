import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

import usePreventGoingBack from '../../../navigation/hooks/usePreventGoingBack';
import useNavigateWithFade from '../../../navigation/hooks/useNavigateWithFade';

import Gutters from '../../../components/Gutters/Gutters';
import VideoTransition from '../VideoTransition/VideoTransition';
import AudioFader from '../AudioFader/AudioFader';
import Button from '../../../components/Buttons/Button';
import P5Animation from '../P5Animation/P5Animation';
import {ExerciseWithLanguage} from '../../../content/types';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import {VideoLooperProperties} from '../../../components/VideoLooper/VideoLooper';

const Spinner = styled.ActivityIndicator({
  ...StyleSheet.absoluteFillObject,
});

const TopBar = styled(Gutters)({
  justifyContent: 'flex-end',
  flexDirection: 'row',
  zIndex: 1,
});

type OutroPortalProps = {
  exercise: ExerciseWithLanguage | null;
  onLeaveSession?: () => void;
  resizeMode?: VideoLooperProperties['resizeMode'];
};

const OutroPortal: React.FC<OutroPortalProps> = ({
  exercise,
  onLeaveSession,
  resizeMode,
}) => {
  const {t} = useTranslation('Screen.Portal');

  const outroPortal = exercise?.outroPortal;
  const introPortal = exercise?.introPortal;

  const isVideo =
    !introPortal?.videoLoop?.p5JsScript?.code &&
    Boolean(introPortal?.videoLoop?.source);

  const [isLoading, setIsLoading] = useState(isVideo);
  const [isReadyToLeave, setIsReadyToLeave] = useState(!isVideo);
  const triggerHapticFeedback = useHapticFeedback();

  usePreventGoingBack();
  useNavigateWithFade();

  const onVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const onVideoTransition = useCallback(() => {
    triggerHapticFeedback();
    setIsReadyToLeave(true);
  }, [triggerHapticFeedback]);

  const onVideoError = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {outroPortal?.video?.source ? (
        <VideoTransition
          endSource={outroPortal.video.source}
          onEnd={onVideoTransition}
          onLoad={onVideoLoad}
          onError={onVideoError}
        />
      ) : (
        <>
          {introPortal?.videoLoop?.audio && (
            <AudioFader
              source={introPortal?.videoLoop.audio}
              repeat
              paused={isLoading}
              volume={isReadyToLeave ? 1 : 0}
              duration={isReadyToLeave ? 20000 : 5000}
            />
          )}
          {introPortal?.videoLoop?.p5JsScript?.code ? (
            <P5Animation script={introPortal.videoLoop.p5JsScript.code} />
          ) : (
            <VideoTransition
              startSource={introPortal?.videoEnd?.source}
              loopSource={introPortal?.videoLoop?.source}
              reverse
              onTransition={onVideoTransition}
              onLoad={onVideoLoad}
              onError={onVideoError}
              resizeMode={resizeMode}
            />
          )}
        </>
      )}

      {isLoading && <Spinner size="large" color={exercise?.theme?.textColor} />}

      <TopBar>
        {onLeaveSession && (
          <Button variant="secondary" size="small" onPress={onLeaveSession}>
            {t('leavePortal')}
          </Button>
        )}
      </TopBar>
    </>
  );
};

export default OutroPortal;
