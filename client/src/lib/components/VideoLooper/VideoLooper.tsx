import React, {useCallback, useMemo, useState} from 'react';
import {requireNativeComponent, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import {VideoLooperProperties} from '../../../../types/VideoLooper';

const RNVideoLooper =
  requireNativeComponent<VideoLooperProperties>('VideoLooper');

const Container = styled.View({
  ...StyleSheet.absoluteFillObject,
});

const StyledRNVideoLooper = styled(RNVideoLooper)({
  ...StyleSheet.absoluteFillObject,
});

const Image = styled.Image({
  ...StyleSheet.absoluteFillObject,
});

const VideoLooper: React.FC<VideoLooperProperties> = ({
  posters,
  onReadyForDisplay,
  ...rest
}) => {
  const [showPoster, setShowPoster] = useState(true);

  const posterSource = useMemo(() => {
    if (rest.sources.start) {
      return {uri: posters?.start};
    }
    if (rest.sources.end) {
      return {uri: posters?.end};
    }
    return {uri: posters?.loop};
  }, [posters, rest.sources]);

  const onReady = useCallback(() => {
    setShowPoster(false);
    if (onReadyForDisplay) {
      onReadyForDisplay();
    }
  }, [setShowPoster, onReadyForDisplay]);

  return (
    <Container>
      <StyledRNVideoLooper {...rest} onReadyForDisplay={onReady} />
      {showPoster && posterSource && <Image source={posterSource} />}
    </Container>
  );
};

export default VideoLooper;
