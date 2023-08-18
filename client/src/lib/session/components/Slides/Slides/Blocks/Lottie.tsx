import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import IdleTimerManager from 'react-native-idle-timer';

import VideoLooper from '../../../../../components/VideoLooper/VideoLooper';
import useSessionState from '../../../../state/state';
import LPlayer, {
  LottiePlayerHandle,
} from '../../../../../components/LottiePlayer/LottiePlayer';
import MediaWrapperResolver from './MediaWrapperResolver';
import {Spacer16} from '../../../../../components/Spacers/Spacer';
import MediaControls from '../../../../../components/MediaControls/MediaControls';
import Subtitles from '../../../../../components/Subtitles/Subtitles';
import Gutters from '../../../../../components/Gutters/Gutters';
import {ProgressTimerContext} from '../../../../context/TimerContext';

const LottiePlayer = styled(LPlayer)({
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

type LottieProps = {
  source: {uri: string};
  audioSource?: string;
  active: boolean;
  duration: number;
  preview?: string;
  autoPlayLoop?: boolean;
  isLive?: boolean;
  subtitles?: string;
};
const Lottie: React.FC<LottieProps> = ({
  active,
  source,
  audioSource,
  duration,
  autoPlayLoop = false,
  isLive,
  subtitles,
}) => {
  const lottieRef = useRef<LottiePlayerHandle>(null);
  const videoRef = useRef<VideoLooper>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
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
      if (audioSource) {
        videoRef.current?.seek(seconds);
      } else {
        lottieRef.current?.seek(seconds);
      }
      progressTimerContext?.onSeek(seconds);
    },
    [audioSource, progressTimerContext],
  );

  useEffect(() => {
    IdleTimerManager.setIdleTimerDisabled(active && !paused);
    return () => IdleTimerManager.setIdleTimerDisabled(false);
  }, [active, paused]);

  useEffect(() => {
    if (!active) {
      setPaused(true);
    } else if (sessionState) {
      setPaused(!sessionState.playing);
    }
  }, [active, setPaused, sessionState]);

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
      const contentDuration = audioDuration > 0 ? audioDuration : duration;

      if (
        timestamp > previousState.current.timestamp &&
        previousState.current.playing === playing
      ) {
        // State is equal, but newer - reset to beginning
        seek(0);
      } else if (timestamp < previousState.current.timestamp && playing) {
        // State is old - compensate time played
        const timeDiff = (new Date().getTime() - timestamp.getTime()) / 1000;
        if (timeDiff < contentDuration) {
          // Do not seek passed video length
          seek(timeDiff);
        } else {
          seek(contentDuration - 1);
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

  useEffect(() => {
    if (active) {
      progressTimerContext?.onLoad(
        audioDuration > 0 ? audioDuration : duration,
      );
    }
  }, [active, duration, audioDuration, progressTimerContext]);

  const onLoad = useCallback<(data: {duration: number}) => void>(
    data => {
      setAudioDuration(data.duration);
    },
    [setAudioDuration],
  );

  const onEnd = useCallback(() => {
    if (!autoPlayLoop) {
      setCurrentContentReachedEnd(true);
      setPaused(true);
    }
  }, [setCurrentContentReachedEnd, autoPlayLoop, setPaused]);

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
      const currentTime = Math.min(audioDuration, data.time);
      setProgress(currentTime);
      progressRef.current = currentTime;
    },
    [setProgress, audioDuration],
  );

  const onToggleSubtitles = useCallback(() => {
    setShowSubtitles(state => !state);
  }, [setShowSubtitles]);

  if (audioSources) {
    // If audio source is available we allways loop the animation
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
          <LottiePlayer
            paused={paused}
            source={source}
            ref={lottieRef}
            repeat
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
                duration={audioDuration}
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
        <LottiePlayer
          paused={paused}
          source={source}
          ref={lottieRef}
          onEnd={onEnd}
          repeat={autoPlayLoop}
        />
      </MediaWrapperResolver>
    </>
  );
};

export default React.memo(Lottie);
