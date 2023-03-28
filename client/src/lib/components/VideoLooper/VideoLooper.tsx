import React from 'react';
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
class VideoLooper extends React.Component<VideoLooperProperties> {
  onEndListener: EmitterSubscription | undefined;
  onTransitionListener: EmitterSubscription | undefined;
  onReadyForDisplayListener: EmitterSubscription | undefined;

  constructor(props: VideoLooperProperties) {
    super(props);
  }

  componentDidMount() {
    if (this.props.onReadyForDisplay) {
      this.onReadyForDisplayListener = DeviceEventEmitter.addListener(
        'onReadyForDisplay',
        this.props.onReadyForDisplay,
      );
    }
    if (this.props.onEnd) {
      this.onEndListener = DeviceEventEmitter.addListener(
        'onEnd',
        this.props.onEnd,
      );
    }
    if (this.props.onTransition) {
      this.onTransitionListener = DeviceEventEmitter.addListener(
        'onTransition',
        this.props.onTransition,
      );
    }
  }

  componentWillUnmount() {
    this.onReadyForDisplayListener?.remove();
    this.onEndListener?.remove();
    this.onTransitionListener?.remove();
  }

  render() {
    return (
      <Container>
        <StyledRNVideoLooper {...this.props} />
      </Container>
    );
  }
}

export default VideoLooper;
