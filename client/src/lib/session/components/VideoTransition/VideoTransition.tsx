import React, {useMemo} from 'react';
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

const VideoLooperStyled = styled(VideoLooper)({
  ...StyleSheet.absoluteFillObject,
});

type VideoTransitionProps = {
  startSource?: string;
  loopSource?: string;
  endSource?: string;
  reverse?: boolean;
  loop?: boolean;
  isLive?: boolean;
  paused?: boolean;
  repeat?: boolean;
  muted?: boolean;
  onReadyForDisplay?: () => void;
  onTransition?: () => void;
  onEnd?: () => void;
};

const VideoTransition: React.FC<VideoTransitionProps> = ({
  startSource,
  loopSource,
  endSource,
  isLive,
  reverse = false,
  paused = false,
  repeat = false,
  muted = false,
  onReadyForDisplay = () => {},
  onTransition = () => {},
  onEnd = () => {},
}) => {
  const startVideoSource = useVideoSource(startSource, reverse);
  const loopVideoSource = useVideoSource(loopSource, reverse);
  const endVideoSource = useVideoSource(endSource, reverse);

  const sourceConfigs: Array<SourceConfig> = useMemo(() => {
    const configs: Array<SourceConfig> = [];
    if (startVideoSource) {
      configs.push({source: startVideoSource});
    }
    if (loopVideoSource) {
      configs.push({source: loopVideoSource, repeat: true});
    }
    if (endVideoSource) {
      configs.push({source: endVideoSource});
    }
    return configs;
  }, [startVideoSource, loopVideoSource, endVideoSource]);

  return (
    <VideoLooperStyled
      sources={sourceConfigs}
      onLoad={onReadyForDisplay}
      onTransition={onTransition}
      volume={muted ? 0 : 1}
      onEnd={onEnd}
      paused={paused}
      repeat={repeat}
      mixWithOthers={isLive}
    />
  );
};

export default React.memo(VideoTransition);
