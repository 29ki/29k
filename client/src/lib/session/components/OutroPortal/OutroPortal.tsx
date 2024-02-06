import React, {useCallback, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import usePreventGoingBack from '../../../navigation/hooks/usePreventGoingBack';
import useNavigateWithFade from '../../../navigation/hooks/useNavigateWithFade';

import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import Gutters from '../../../components/Gutters/Gutters';
import Screen from '../../../components/Screen/Screen';
import {BottomSafeArea, TopSafeArea} from '../../../components/Spacers/Spacer';
import {SPACINGS} from '../../../constants/spacings';
import VideoTransition from '../VideoTransition/VideoTransition';
import AudioFader from '../AudioFader/AudioFader';
import Button from '../../../components/Buttons/Button';
import P5Animation from '../P5Animation/P5Animation';

const Spinner = styled.ActivityIndicator({
  ...StyleSheet.absoluteFillObject,
});

const TopBar = styled(Gutters)({
  justifyContent: 'flex-end',
  flexDirection: 'row',
});

type OutroPortalProps = {
  exercise: Exercise | null;
  onLeaveSession: () => void;
};

const OutroPortal: React.FC<OutroPortalProps> = ({
  exercise,
  onLeaveSession,
}) => {
  const {t} = useTranslation('Screen.Portal');

  const outroPortal = exercise?.outroPortal;
  const introPortal = exercise?.introPortal;

  const isVideo =
    !introPortal?.videoLoop?.p5JsScript?.code &&
    Boolean(introPortal?.videoLoop?.source);

  const [isLoading, setIsLoading] = useState(isVideo);
  const [isReadyToLeave, setIsReadyToLeave] = useState(!isVideo);
  usePreventGoingBack();
  useNavigateWithFade();

  const onVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const onVideoTransition = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    setIsReadyToLeave(true);
  };

  const onVideoError = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Screen backgroundColor={exercise?.theme?.backgroundColor}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <StatusBar hidden />

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
              muted
              onTransition={onVideoTransition}
              onLoad={onVideoLoad}
              onError={onVideoError}
            />
          )}
        </>
      )}

      <TopSafeArea minSize={SPACINGS.SIXTEEN} />

      {isLoading && <Spinner size="large" color={exercise?.theme?.textColor} />}

      <TopBar>
        <Button variant="secondary" size="small" onPress={onLeaveSession}>
          {t('leavePortal')}
        </Button>
      </TopBar>

      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default OutroPortal;
