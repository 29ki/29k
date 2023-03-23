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

const Image = styled.Image({
  ...StyleSheet.absoluteFillObject,
});

class VideoLooper extends React.Component<
  VideoLooperProperties,
  {showPoster: boolean; posterSource?: {uri: string}; repeat?: boolean}
> {
  onEndListener: EmitterSubscription | undefined;
  onTransitionListener: EmitterSubscription | undefined;
  onReadyForDisplayListener: EmitterSubscription | undefined;

  constructor(props: VideoLooperProperties) {
    super(props);
    this.setRepeat = this.setRepeat.bind(this);
    this.onReady = this.onReady.bind(this);
    const {poster} = props;
    this.state = {
      showPoster: poster ? true : false,
      posterSource: poster ? {uri: poster} : undefined,
    };
  }

  componentDidMount() {
    this.onReadyForDisplayListener = DeviceEventEmitter.addListener(
      'onReadyForDisplay',
      this.onReady,
    );
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

  setRepeat(repeat: boolean) {
    this.setState({repeat});
  }

  onReady() {
    this.setState({showPoster: false});
    if (this.props.onReadyForDisplay) {
      this.props.onReadyForDisplay();
    }
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {poster, onReadyForDisplay, ...rest} = this.props;
    return (
      <Container>
        <StyledRNVideoLooper
          {...rest}
          repeat={this.state.repeat}
          onReadyForDisplay={this.onReady}
        />
        {this.state.showPoster && this.state.posterSource && (
          <Image source={this.state.posterSource} />
        )}
      </Container>
    );
  }
}

export default VideoLooper;
