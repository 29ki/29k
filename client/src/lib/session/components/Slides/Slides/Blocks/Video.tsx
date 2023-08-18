import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components/native';
import {View} from 'react-native';

import useSessionState from '../../../../state/state';
import {VideoLooperProperties} from '../../../../../../../types/VideoLooper';
import VideoLooper from '../../../../../components/VideoLooper/VideoLooper';
import MediaControls from '../../../../../components/MediaControls/MediaControls';
import {Spacer16} from '../../../../../components/Spacers/Spacer';
import MediaWrapperResolver from './MediaWrapperResolver';
import Subtitles from '../../../../../components/Subtitles/Subtitles';
import Gutters from '../../../../../components/Gutters/Gutters';
import {ProgressTimerContext} from '../../../../context/TimerContext';

const VideoPlayer = styled(VideoLooper)({
  flex: 1,
});

const AudioPlayer = styled(VideoLooper)({
  display: 'none',
});

const SubtitleContainer = styled.View({
  position: 'absolute',
  top: -70,
  left: 0,
  right: 0,
  flex: 1,
  alignItems: 'center',
});

type VideoProps = {
  source?: string;
  audioSource?: string;
  active: boolean;
  preview?: string;
  autoPlayLoop?: boolean;
  isLive?: boolean;
  subtitles?: string;
};
const Video: React.FC<VideoProps> = ({
  active,
  source,
  audioSource,
  isLive,
  subtitles,
  autoPlayLoop = false,
}) => {
  const videoRef = useRef<VideoLooper>(null);
  const progressRef = useRef(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSubtitels, setShowSubtitles] = useState<boolean | undefined>(
    subtitles ? false : undefined,
  );
  const sessionState = useSessionState(state => state.sessionState);
  const [paused, setPaused] = useState(
    !active || (!sessionState?.playing && !autoPlayLoop),
  );
  const setCurrentContentReachedEnd = useSessionState(
    state => state.setCurrentContentReachedEnd,
  );
  const previousState = useRef({playing: false, timestamp: new Date()});
  const progressTimerContext = useContext(ProgressTimerContext);

  const seek = useCallback(
    (seconds: number) => {
      videoRef.current?.seek(seconds);
      progressTimerContext?.onSeek(seconds);
    },
    [progressTimerContext],
  );

  useEffect(() => {
    if (!active) {
      setPaused(true);
    } else if (sessionState) {
      setPaused(!sessionState.playing);
    }
  }, [active, setPaused, sessionState]);

  useEffect(() => {
    if (active && !autoPlayLoop && duration && sessionState) {
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

  useEffect(() => {
    if (active) {
      progressTimerContext?.onLoad(duration);
    }
  }, [active, duration, progressTimerContext]);

  const onLoad = useCallback<(data: {duration: number}) => void>(
    data => {
      setDuration(data.duration);
    },
    [setDuration],
  );

  const onEnd = useCallback(() => {
    if (!autoPlayLoop) {
      setCurrentContentReachedEnd(true);
      setPaused(true);
    }
  }, [setCurrentContentReachedEnd, autoPlayLoop, setPaused]);

  const videoSource: VideoLooperProperties['sources'] = useMemo(() => {
    if (source) {
      return [
        {
          source,
          muted: audioSource ? true : false,
          // If audio source is available we allways loop the video and handle the audio separateley as the primary playing source
          repeat: audioSource ? true : false,
        },
      ];
    }
    return [];
  }, [source, audioSource]);

  const audioSources = useMemo(() => {
    if (audioSource) {
      return [{source: audioSource, repeat: autoPlayLoop}];
    }
  }, [audioSource, autoPlayLoop]);

  const onSkipBack = useCallback(() => {
    videoRef.current?.seek(Math.max(progressRef.current - 15, 0));
  }, []);

  const onSkipForward = useCallback(() => {
    videoRef.current?.seek(progressRef.current + 15);
  }, []);

  const onTogglePlay = useCallback(() => {
    setPaused(state => !state);
  }, [setPaused]);

  const onProgress = useCallback(
    (data: {time: number}) => {
      const currentTime = Math.min(Math.round(duration), Math.round(data.time));
      setProgress(currentTime);
      progressRef.current = currentTime;
    },
    [setProgress, duration],
  );

  const onToggleSubtitles = useCallback(() => {
    setShowSubtitles(state => !state);
  }, [setShowSubtitles]);

  if (audioSources) {
    return (
      <>
        <MediaWrapperResolver isLive={isLive}>
          <AudioPlayer
            sources={audioSources}
            ref={videoRef}
            volume={1}
            onLoad={onLoad}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={paused}
            mixWithOthers={isLive}
          />
          <VideoPlayer
            sources={videoSource}
            paused={paused}
            mixWithOthers={isLive}
          />
        </MediaWrapperResolver>

        {!isLive && (
          <View>
            {showSubtitels && subtitles && (
              <SubtitleContainer>
                <Subtitles src={subtitles} time={progress} />
              </SubtitleContainer>
            )}
            <Spacer16 />
            <Gutters big>
              <MediaControls
                time={progress}
                duration={duration}
                playing={!paused}
                onSkipBack={onSkipBack}
                onTogglePlay={onTogglePlay}
                onSkipForward={onSkipForward}
                onToggleSubtitles={onToggleSubtitles}
                subtitles={subtitles ? showSubtitels : undefined}
              />
            </Gutters>
          </View>
        )}
      </>
    );
  }

  return (
    <>
      <MediaWrapperResolver isLive={isLive}>
        <VideoPlayer
          sources={videoSource}
          paused={paused}
          ref={videoRef}
          volume={1}
          onLoad={onLoad}
          onProgress={onProgress}
          onEnd={onEnd}
          mixWithOthers={isLive}
        />
      </MediaWrapperResolver>
      {!isLive && (
        <View>
          {showSubtitels && subtitles && (
            <SubtitleContainer>
              <Subtitles src={subtitles} time={progress} />
            </SubtitleContainer>
          )}
          <Spacer16 />
          <Gutters big>
            <MediaControls
              time={progress}
              duration={duration}
              playing={!paused}
              onSkipBack={onSkipBack}
              onTogglePlay={onTogglePlay}
              onSkipForward={onSkipForward}
              onToggleSubtitles={onToggleSubtitles}
              subtitles={subtitles ? showSubtitels : undefined}
            />
          </Gutters>
        </View>
      )}
    </>
  );
};

export default React.memo(Video);
