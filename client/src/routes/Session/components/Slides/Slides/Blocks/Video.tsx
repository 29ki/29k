import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties} from 'react-native-video';
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
};
const Video: React.FC<VideoProps> = React.memo(
  ({
    active,
    source,
    audioSource,
    preview,
    autoPlayLoop = false,
    durationTimer = false,
  }) => {
    const videoRef = useRef<RNVideo>(null);
    const timerRef = useRef<DurationTimerHandle>(null);
    const [duration, setDuration] = useState(0);
    const exerciseState = useSessionState(
      state => state.session?.exerciseState,
    );
    const previousState = useRef({playing: false, timestamp: new Date()});

    const seek = (seconds: number) => {
      videoRef.current?.seek(seconds);
      timerRef.current?.seek(seconds);
    };

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
        }

        // Update previous state
        previousState.current = {
          playing,
          timestamp,
        };
      }
    }, [active, autoPlayLoop, duration, previousState, exerciseState]);

    const onLoad: VideoProperties['onLoad'] = data =>
      setDuration(data.duration);

    const paused = !active || (!exerciseState?.playing && !autoPlayLoop);

    const videoProps: VideoProperties = {
      source,
      poster: preview,
      resizeMode: 'contain',
      posterResizeMode: 'contain',
      paused,
    };

    const timer = durationTimer ? (
      <Duration duration={duration} paused={paused} ref={timerRef} />
    ) : null;

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
          repeat={autoPlayLoop}
        />
        {timer}
      </>
    );
  },
  (prev, next) => prev.active === next.active,
);

export default Video;
