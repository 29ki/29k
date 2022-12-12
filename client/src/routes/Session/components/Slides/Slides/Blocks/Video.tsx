import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components/native';
import RNVideo, {
  VideoProperties,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';

import useSessionState from '../../../../state/state';
import VideoBase from '../../../VideoBase/VideoBase';
import DurationTimer, {
  DurationTimerHandle,
} from '../../../DurationTimer/DurationTimer';

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
  resetCallback?: () => void;
};
const Video: React.FC<VideoProps> = ({
  active,
  source,
  audioSource,
  preview,
  autoPlayLoop = false,
  durationTimer = false,
  resetCallback,
}) => {
  const videoRef = useRef<RNVideo>(null);
  const timerRef = useRef<DurationTimerHandle>(null);
  const progressRef = useRef<number>(0);
  const [duration, setDuration] = useState(0);
  const exerciseState = useSessionState(state => state.session?.exerciseState);
  const previousState = useRef({playing: false, timestamp: new Date()});

  const seek = useCallback((seconds: number) => {
    videoRef.current?.seek(seconds);
    timerRef.current?.seek(seconds);
  }, []);

  useEffect(() => {
    if (active && !autoPlayLoop && duration && exerciseState) {
      // Block is active, video and state is loaded
      const playing = exerciseState.playing;
      const timestamp = new Date(exerciseState.timestamp);

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
      } else if (!previousState.current.playing && playing) {
        const diff = Math.abs(progressRef.current - duration);
        const tolerance = 0.5; // So close to the end a pause and play could be considered a reset

        if (diff < tolerance) {
          progressRef.current = 0; // Reset this to keep track of when to reset
          seek(0);
        }
      }

      // Update previous state
      previousState.current = {
        playing,
        timestamp,
      };
    }
  }, [active, autoPlayLoop, duration, previousState, exerciseState, seek]);

  const onLoad = useCallback<(data: OnLoadData) => void>(
    data => {
      setDuration(data.duration);
    },
    [setDuration],
  );

  const onProgress = useCallback((data: OnProgressData) => {
    // No need for this to be state and cause re-renders
    progressRef.current = data.currentTime;
  }, []);

  const onEnd = useCallback(() => {
    // seek(0) does not reset progress so a second onEnd is triggered
    // Check that the progressRef is not set back to zero to trigger a reset
    if (resetCallback && !autoPlayLoop && progressRef.current > 0) {
      resetCallback();
    }
  }, [resetCallback, autoPlayLoop]);

  const paused = !active || (!exerciseState?.playing && !autoPlayLoop);

  const videoProps: VideoProperties = useMemo(
    () => ({
      source,
      poster: preview,
      resizeMode: 'contain',
      posterResizeMode: 'contain',
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
        onProgress={onProgress}
        repeat={autoPlayLoop}
      />
      {timer}
    </>
  );
};

export default Video;
