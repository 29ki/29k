import React, {useCallback, useState} from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useIsFocused} from '@react-navigation/native';

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

  const [isReadyForDisplay, setIsReadyForDisplay] = useState(false);
  const [isReadyToLeave, setIsReadyToLeave] = useState(false);
  const isFocused = useIsFocused();
  usePreventGoingBack();
  useNavigateWithFade();

  const outroPortal = exercise?.outroPortal;
  const introPortal = exercise?.introPortal;

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
          <Button variant="secondary" small onPress={onLeaveSession}>
            {t('leavePortal')}
          </Button>
        </TopBar>
      )}
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default OutroPortal;
