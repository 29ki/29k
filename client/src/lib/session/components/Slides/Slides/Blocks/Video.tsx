import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties, OnLoadData} from 'react-native-video';

import useSessionState from '../../../../state/state';
import VideoBase from '../../../VideoBase/VideoBase';
import DurationTimer from '../../../DurationTimer/DurationTimer';
import {LottiePlayerHandle} from '../../../../../components/LottiePlayer/LottiePlayer';

const VideoPlayer = styled(VideoBase)({
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

type VideoProps = {
  source: VideoProperties['source'];
  audioSource?: VideoProperties['source'];
  active: boolean;
  preview?: string;
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
};
const Video: React.FC<VideoProps> = ({
  active,
  source,
  audioSource,
  preview,
  autoPlayLoop = false,
  durationTimer = false,
}) => {
  const videoRef = useRef<RNVideo>(null);
  const timerRef = useRef<LottiePlayerHandle>(null);
  const onEndRef = useRef<boolean>(false);
  const [duration, setDuration] = useState(0);
  const sessionState = useSessionState(state => state.sessionState);
  const setCurrentContentReachedEnd = useSessionState(
    state => state.setCurrentContentReachedEnd,
  );
  const previousState = useRef({playing: false, timestamp: new Date()});

  const seek = useCallback((seconds: number) => {
    videoRef.current?.seek(seconds);
    timerRef.current?.seek(seconds);
  }, []);

  useEffect(() => {
    if (active && !autoPlayLoop && duration && sessionState) {
      // Block is active, video and state is loaded
      const playing = sessionState.playing;
      const timestamp = new Date(sessionState.timestamp);

      // Reset onEndRef when playing
      if (playing) {
        onEndRef.current = false;
      }

      if (
        timestamp > previousState.current.timestamp &&
        previousState.current.playing === playing
      ) {
        // State is equal, but newer - reset to beginning
        seek(0);
      } else if (timestamp < previousState.current.timestamp && playing) {
        // State is old - compensate time played
        const timeDiff = (new Date().getTime() - timestamp.getTime()) / 1000;
        if (timeDiff < duration) {
          // Do not seek passed video length
          seek(timeDiff);
        } else {
          seek(duration - 1);
        }
      }

      // Update previous state
      previousState.current = {
        playing,
        timestamp,
      };
    }
  }, [active, autoPlayLoop, duration, previousState, sessionState, seek]);

  const onLoad = useCallback<(data: OnLoadData) => void>(
    data => {
      setDuration(data.duration);
    },
    [setDuration],
  );

  const paused = !active || (!sessionState?.playing && !autoPlayLoop);

  const onEnd = useCallback(() => {
    // seek(0) does not reset progress so a second onEnd is triggered
    // Check that the progressRef is not set back to zero to trigger a reset
    if (!autoPlayLoop && !onEndRef.current) {
      onEndRef.current = true;
      setCurrentContentReachedEnd(true);
    }
  }, [setCurrentContentReachedEnd, autoPlayLoop]);

  const videoProps: VideoProperties = useMemo(
    () => ({
      source,
      poster: preview,
      resizeMode: 'cover',
      posterResizeMode: 'cover',
      paused,
    }),
    [paused, preview, source],
  );

  const timer = useMemo(
    () =>
      durationTimer ? (
        <Duration duration={duration} paused={paused} ref={timerRef} />
      ) : null,
    [durationTimer, paused, duration],
  );

  if (audioSource) {
    // If audio source is available we allways loop the video and handle the audio separateley as the primary playing source
    return (
      <>
        <AudioPlayer
          source={audioSource}
          audioOnly
          ref={videoRef}
          onLoad={onLoad}
          repeat={autoPlayLoop}
          paused={paused}
        />
        <VideoPlayer {...videoProps} muted repeat />
        {timer}
      </>
    );
  }

  return (
    <>
      <VideoPlayer
        {...videoProps}
        ref={videoRef}
        onLoad={onLoad}
        onEnd={onEnd}
        repeat={autoPlayLoop}
      />
      {timer}
    </>
  );
};

export default React.memo(Video);
