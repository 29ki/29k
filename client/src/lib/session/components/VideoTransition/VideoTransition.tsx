import React, {useMemo} from 'react';
import Sentry from '../../../sentry';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import VideoLooper from '../../../components/VideoLooper/VideoLooper';

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
    () => (source && reverse ? reverseVideo(source) : source),
    [source, reverse],
  );

const VideoLooperStyled = styled(VideoLooper)(({paused}) => ({
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

const VideoTransition: React.FC<VideoTransitionProps> = ({
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
  const startVideoSource = useVideoSource(startSource, reverse);
  const loopVideoSource = useVideoSource(loopSource, reverse);
  const endVideoSource = useVideoSource(endSource, reverse);

  const sources = useMemo(
    () => ({
      start: startVideoSource,
      loop: loopVideoSource,
      end: endVideoSource,
    }),
    [startVideoSource, loopVideoSource, endVideoSource],
  );

  const mutes = useMemo(
    () => ({
      loop: true,
      start: true,
      end: false,
    }),
    [],
  );

  const posters = useMemo(
    () => ({
      start: startPosterSource,
      loop: loopPosterSource,
      end: endPosterSource,
    }),
    [startPosterSource, loopPosterSource, endPosterSource],
  );

  return (
    <VideoLooperStyled
      sources={sources}
      mutes={mutes}
      posters={posters}
      onReadyForDisplay={onReadyForDisplay}
      onStartEnd={onTransition}
      onTransition={onTransition}
      onEnd={onEnd}
      repeat={loop}
      paused={paused}
    />
  );
};

export default React.memo(VideoTransition);
