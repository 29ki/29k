import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import RNVideo, {OnLoadData} from 'react-native-video';

import useSessionState from '../../../../state/state';
import DurationTimer from '../../../DurationTimer/DurationTimer';
import LPlayer, {
  LottiePlayerHandle,
} from '../../../../../components/LottiePlayer/LottiePlayer';
import {VideoBase} from '../../../VideoBase/VideoBase';

const LottiePlayer = styled(LPlayer)({
  flex: 1,
});

const AudioPlayer = styled(VideoBase)({
  display: 'none',
});

const Duration = styled(DurationTimer)({
  position: 'absolute',
  right: 22,
  top: 16,
  width: 30,
  height: 30,
});

type LottieProps = {
  source: {uri: string};
  audioSource?: {uri: string};
  active: boolean;
  duration: number;
  preview?: string;
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
};
const Lottie: React.FC<LottieProps> = ({
  active,
  source,
  audioSource,
  duration,
  autoPlayLoop = false,
  durationTimer = false,
}) => {
  const lottieRef = useRef<LottiePlayerHandle>(null);
  const videoRef = useRef<RNVideo>(null);
  const timerRef = useRef<LottiePlayerHandle>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const sessionState = useSessionState(state => state.sessionState);
  const setCurrentContentReachedEnd = useSessionState(
    state => state.setCurrentContentReachedEnd,
  );
  const previousState = useRef({playing: false, timestamp: new Date()});

  const seek = useCallback(
    (seconds: number) => {
      if (audioSource) {
        videoRef.current?.seek(seconds);
      } else {
        lottieRef.current?.seek(seconds);
      }

      timerRef.current?.seek(seconds);
    },
    [audioSource],
  );

  useEffect(() => {
    if (
      active &&
      !autoPlayLoop &&
      (duration || audioDuration) &&
      sessionState
    ) {
      // Block is active, video and state is loaded
      const playing = sessionState.playing;
      const timestamp = new Date(sessionState.timestamp);

      if (
        timestamp > previousState.current.timestamp &&
        previousState.current.playing === playing
      ) {
        // State is equal, but newer - reset to beginning
        seek(0);
      } else if (timestamp < previousState.current.timestamp && playing) {
        // State is old - compensate time played
        const timeDiff = (new Date().getTime() - timestamp.getTime()) / 1000;
        const usedDuration = audioDuration > 0 ? audioDuration : duration;
        if (timeDiff < usedDuration) {
          // Do not seek passed video length
          seek(timeDiff);
        } else {
          seek(usedDuration - 1);
        }
      }

      // Update previous state
      previousState.current = {
        playing,
        timestamp,
      };
    }
  }, [
    active,
    autoPlayLoop,
    duration,
    audioDuration,
    previousState,
    sessionState,
    seek,
  ]);

  const onLoad = useCallback<(data: OnLoadData) => void>(
    data => {
      setAudioDuration(data.duration);
    },
    [setAudioDuration],
  );

  const onEnd = useCallback(() => {
    if (!autoPlayLoop) {
      setCurrentContentReachedEnd(true);
    }
  }, [setCurrentContentReachedEnd, autoPlayLoop]);

  const paused = !active || (!sessionState?.playing && !autoPlayLoop);

  const audioTimer = useMemo(
    () =>
      durationTimer && audioDuration ? (
        <Duration duration={audioDuration} paused={paused} ref={timerRef} />
      ) : null,
    [durationTimer, paused, audioDuration],
  );

  if (audioSource) {
    // If audio source is available we allways loop the animation
    return (
      <>
        <AudioPlayer
          source={audioSource}
          audioOnly
          ref={videoRef}
          onLoad={onLoad}
          onEnd={onEnd}
          repeat={autoPlayLoop}
          paused={paused}
        />
        <LottiePlayer
          paused={paused}
          source={source}
          duration={duration}
          ref={lottieRef}
          repeat
        />
        {audioTimer}
      </>
    );
  }

  return (
    <>
      <LottiePlayer
        paused={paused}
        source={source}
        duration={duration}
        ref={lottieRef}
        onEnd={onEnd}
        repeat={autoPlayLoop}
      />
      {durationTimer && (
        <Duration duration={duration} paused={paused} ref={timerRef} />
      )}
    </>
  );
};

export default React.memo(Lottie);
