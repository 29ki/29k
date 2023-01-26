import React, {useCallback, useMemo, useRef, useState} from 'react';
import Sentry from '../../../../lib/sentry';
import styled from 'styled-components/native';
import Video from 'react-native-video';
import {StyleSheet} from 'react-native';
import VideoBase from '../VideoBase/VideoBase';

const reverseVideo = (url: string) => {
  const transformFlags = (url.match(/cloudinary.*\/upload\/?(.*)\/v/) ?? [])[1];

  if (transformFlags === undefined) {
    Sentry.captureException(
      new Error(`Could not reverse the video - Invalid url ${url}`),
    );
    return url;
  }

  if (transformFlags === '') {
    return url.replace('/upload/v', '/upload/e_reverse/v');
  } else {
    return url.replace(transformFlags, `${transformFlags},e_reverse`);
  }
};

const useVideoSource = (source: string | undefined, reverse = false) =>
  useMemo(
    () => source && {uri: reverse ? source : reverseVideo(source)},
    [source, reverse],
  );

const VideoStyled = styled(VideoBase)(({paused}) => ({
  opacity: paused ? 0 : 1,
  ...StyleSheet.absoluteFillObject,
}));

type VideoTransitionProps = {
  startSource?: string;
  startPosterSource?: string;
  loopSource?: string;
  loopPosterSource?: string;
  endSource?: string;
  endPosterSource?: string;
  reverse?: boolean;
  loop?: boolean;
  paused?: boolean;
  onReadyForDisplay?: () => void;
  onTransition?: () => void;
  onEnd?: () => void;
};
export const VideoTransition = React.memo<VideoTransitionProps>(
  ({
    startSource,
    startPosterSource,
    loopSource,
    loopPosterSource,
    endSource,
    endPosterSource,
    reverse = false,
    loop = true,
    paused = false,
    onReadyForDisplay = () => {},
    onTransition = () => {},
    onEnd = () => {},
  }) => {
    const startVideoRef = useRef<Video>(null);
    const loopVideoRef = useRef<Video>(null);
    const endVideoRef = useRef<Video>(null);
    const [isLooping, setIsLooping] = useState(startSource ? false : true);
    const [isEnding, setIsEnding] = useState(loopSource ? false : true);

    const startVideoSource = useVideoSource(startSource, reverse);
    const loopVideoSource = useVideoSource(loopSource, reverse);
    const endVideoSource = useVideoSource(endSource, reverse);

    const onStartReadyForDisplay = useCallback(() => {
      startVideoRef.current?.seek(0);
      onReadyForDisplay();
    }, [onReadyForDisplay]);

    const onLoopReadyForDisplay = useCallback(() => {
      loopVideoRef.current?.seek(0);
      onReadyForDisplay();
    }, [onReadyForDisplay]);

    const onEndReadyForDisplay = useCallback(() => {
      endVideoRef.current?.seek(0);
      onReadyForDisplay();
    }, [onReadyForDisplay]);

    const onStartEnd = useCallback(() => {
      if (loop) {
        setIsLooping(true);
        onTransition();
      }
    }, [loop, setIsLooping, onTransition]);

    const onLoopEnd = useCallback(() => {
      if (!loop) {
        setIsEnding(true);
        onTransition();
      }
    }, [loop, setIsEnding, onTransition]);

    return (
      <>
        {loopVideoSource && (
          <VideoStyled
            ref={loopVideoRef}
            source={loopVideoSource}
            resizeMode="cover"
            poster={loopPosterSource}
            posterResizeMode="cover"
            onReadyForDisplay={onLoopReadyForDisplay}
            onEnd={onLoopEnd}
            paused={paused || !isLooping}
            repeat={loop}
            muted
          />
        )}

        {startVideoSource && (
          <VideoStyled
            ref={startVideoRef}
            source={startVideoSource}
            resizeMode="cover"
            poster={startPosterSource}
            posterResizeMode="cover"
            onReadyForDisplay={onStartReadyForDisplay}
            onEnd={onStartEnd}
            paused={paused || isLooping}
            muted
          />
        )}

        {endVideoSource && (
          <VideoStyled
            ref={endVideoRef}
            source={endVideoSource}
            resizeMode="cover"
            poster={endPosterSource}
            posterResizeMode="cover"
            onReadyForDisplay={onEndReadyForDisplay}
            onEnd={onEnd}
            paused={paused || !isEnding}
          />
        )}
      </>
    );
  },
);
