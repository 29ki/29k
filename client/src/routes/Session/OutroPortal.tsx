import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';

import {
  BottomSafeArea,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';
import useSessionExercise from './hooks/useSessionExercise';
import useLeaveSession from './hooks/useLeaveSession';
import VideoBase from './components/VideoBase/VideoBase';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import useNavigateWithFade from '../../lib/navigation/hooks/useNavigateWithFade';
import Screen from '../../common/components/Screen/Screen';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useIsFocused} from '@react-navigation/native';
import Button from '../../common/components/Buttons/Button';
import {useTranslation} from 'react-i18next';

const VideoStyled = styled(VideoBase)({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
});

const reverseVideo = (url: string) => {
  const transformFlags = (url.match(/upload\/?(.*)\/v/) ?? [])[1];

  if (transformFlags === undefined) {
    return url;
  }

  if (transformFlags === '') {
    return url.replace('/upload/v', '/upload/q_auto,t_global,e_reverse/v');
  } else {
    return url.replace(transformFlags, `${transformFlags},e_reverse`);
  }
};

const OutroPortal: React.FC = () => {
  const finalVidRef = useRef<Video>(null);
  const exercise = useSessionExercise();
  const {leaveSession} = useLeaveSession();
  const [readyToLeave, setReadyToLeave] = useState(false);
  const isFocused = useIsFocused();
  const {t} = useTranslation('Screen.Portal');

  usePreventGoingBack();
  useNavigateWithFade();

  const outroPortal = exercise?.outroPortal;
  const introPortal = exercise?.introPortal;

  useEffect(() => {
    if (
      !outroPortal?.video &&
      (!introPortal?.videoEnd || !introPortal?.videoLoop)
    ) {
      leaveSession();
    }
  }, [
    introPortal?.videoEnd,
    introPortal?.videoLoop,
    outroPortal?.video,
    leaveSession,
  ]);

  if (
    outroPortal?.video?.source &&
    (!introPortal?.videoLoop?.source || !introPortal?.videoEnd?.source)
  ) {
    return null;
  }

  const onEndVideoLoad = () => {
    finalVidRef.current?.seek(0);
  };

  const onLoopVideoEnd = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    setReadyToLeave(true);
  };

  return (
    <Screen>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />

      {!outroPortal?.video?.source &&
        introPortal?.videoLoop?.source &&
        introPortal?.videoEnd?.source && (
          <>
            <VideoStyled
              ref={finalVidRef}
              onLoad={onEndVideoLoad}
              paused={!readyToLeave || !isFocused}
              source={{uri: reverseVideo(introPortal.videoLoop.source)}}
              resizeMode="cover"
              posterResizeMode="cover"
              repeat={true}
            />

            {!readyToLeave && (
              <VideoStyled
                onEnd={onLoopVideoEnd}
                paused={!isFocused}
                source={{uri: reverseVideo(introPortal.videoEnd.source)}}
                resizeMode="cover"
                poster={introPortal.videoEnd?.preview}
                posterResizeMode="cover"
              />
            )}
          </>
        )}

      {outroPortal?.video?.source && (
        <VideoStyled
          ref={finalVidRef}
          onLoad={() => finalVidRef.current?.seek(0)}
          source={{uri: outroPortal.video.source}}
          resizeMode="cover"
          poster={outroPortal.video?.preview}
          posterResizeMode="cover"
          repeat={true}
        />
      )}
      {readyToLeave && (
        <Button small onPress={() => leaveSession()}>
          {t('leavePortal')}
        </Button>
      )}
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default OutroPortal;
