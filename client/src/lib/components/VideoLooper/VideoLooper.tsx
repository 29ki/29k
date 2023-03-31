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
  overflow: 'hidden',
});

const StyledRNVideoLooper = styled(RNVideoLooper)({
  ...StyleSheet.absoluteFillObject,
});

type VideoLooperProps = Omit<VideoLooperProperties, 'seek'>;
type VideoLooperState = {seek?: number};
class VideoLooper extends React.Component<VideoLooperProps, VideoLooperState> {
  onEndListener: EmitterSubscription | undefined;
  onTransitionListener: EmitterSubscription | undefined;
  onLoadListener: EmitterSubscription | undefined;

  constructor(props: VideoLooperProps) {
    super(props);
    this.seek = this.seek.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.state = {};
  }

  onLoad(event: any) {
    if (this.props.onLoad) {
      this.props.onLoad(event.nativeEvent);
    }
  }

  componentDidMount() {
    if (this.props.onLoad) {
      this.onLoadListener = DeviceEventEmitter.addListener(
        'onLoad',
        this.props.onLoad,
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
    this.onLoadListener?.remove();
    this.onEndListener?.remove();
    this.onTransitionListener?.remove();
  }

  componentDidUpdate(
    _: Readonly<VideoLooperProps>,
    prevState: Readonly<VideoLooperState>,
  ) {
    if (prevState.seek !== undefined) {
      this.setState({seek: undefined});
    }
  }

  seek(to: number) {
    this.setState({seek: to});
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {onLoad, ...rest} = this.props;
    return (
      <Container>
        <StyledRNVideoLooper
          seek={this.state.seek}
          onLoad={this.onLoad}
          {...rest}
        />
      </Container>
    );
  }
}

export default VideoLooper;
