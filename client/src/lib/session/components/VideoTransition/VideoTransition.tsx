import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import Sentry from '../../../sentry';
import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import VideoLooper from '../../../components/VideoLooper/VideoLooper';
import {SourceConfig} from '../../../../../types/VideoLooper';

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
  loopSource?: string;
  endSource?: string;
  posterSource?: string;
  reverse?: boolean;
  loop?: boolean;
  paused?: boolean;
  onReadyForDisplay?: () => void;
  onTransition?: () => void;
  onEnd?: () => void;
};

export type VideoLooperHandle = {
  setRepeat: (releat: boolean) => void;
};

const VideoTransition = forwardRef<VideoLooperHandle, VideoTransitionProps>(
  (
    {
      startSource,
      loopSource,
      endSource,
      posterSource,
      reverse = false,
      paused = false,
      onReadyForDisplay = () => {},
      onTransition = () => {},
      onEnd = () => {},
    },
    ref,
  ) => {
    const videoLooperRef = useRef<VideoLooper>(null);
    const startVideoSource = useVideoSource(startSource, reverse);
    const loopVideoSource = useVideoSource(loopSource, reverse);
    const endVideoSource = useVideoSource(endSource, reverse);

    const setRepeat = useCallback((repeat: boolean) => {
      videoLooperRef.current?.setRepeat(repeat);
    }, []);

    useImperativeHandle(ref, () => ({setRepeat}), [setRepeat]);

    const sourceConfigs: Array<SourceConfig> = useMemo(() => {
      const configs: Array<SourceConfig> = [];
      if (startVideoSource) {
        configs.push({source: startVideoSource, muted: true});
      }
      if (loopVideoSource) {
        configs.push({source: loopVideoSource, muted: true, repeat: true});
      }
      if (endVideoSource) {
        configs.push({source: endVideoSource});
      }
      return configs;
    }, [startVideoSource, loopVideoSource, endVideoSource]);

    return (
      <VideoLooperStyled
        ref={videoLooperRef}
        sources={sourceConfigs}
        poster={posterSource}
        onReadyForDisplay={onReadyForDisplay}
        onTransition={onTransition}
        onEnd={onEnd}
        paused={paused}
      />
    );
  },
);

export default React.memo(VideoTransition);
