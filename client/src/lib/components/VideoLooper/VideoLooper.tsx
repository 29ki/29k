import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  requireNativeComponent,
  StyleSheet,
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native';
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

  // Needed to explicitly hook up event listeners to Android
  useEffect(() => {
    let onEndListener: EmitterSubscription | undefined;
    let onStartEndListener: EmitterSubscription | undefined;
    let onTransitionListener: EmitterSubscription | undefined;
    const onReadyForDisplayListener = DeviceEventEmitter.addListener(
      'onReadyForDisplay',
      onReady,
    );

    if (rest.onEnd) {
      onEndListener = DeviceEventEmitter.addListener('onEnd', rest.onEnd);
    }
    if (rest.onStartEnd) {
      onStartEndListener = DeviceEventEmitter.addListener(
        'onStartEnd',
        rest.onStartEnd,
      );
    }
    if (rest.onTransition) {
      onTransitionListener = DeviceEventEmitter.addListener(
        'onTransition',
        rest.onTransition,
      );
    }

    return () => {
      onReadyForDisplayListener.remove();
      onEndListener?.remove();
      onStartEndListener?.remove();
      onTransitionListener?.remove();
    };
  }, [onReady, rest]);

  return (
    <Container>
      <StyledRNVideoLooper {...rest} onReadyForDisplay={onReady} />
      {showPoster && posterSource && <Image source={posterSource} />}
    </Container>
  );
};

export default VideoLooper;
