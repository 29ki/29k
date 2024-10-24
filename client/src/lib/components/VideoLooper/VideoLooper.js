import React from 'react';
import {requireNativeComponent, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Sentry from '../../sentry';

const RNVideoLooper = requireNativeComponent('VideoLooper');

const Container = styled.View({
  ...StyleSheet.absoluteFillObject,
  overflow: 'hidden',
});

const StyledRNVideoLooper = styled(RNVideoLooper)({
  ...StyleSheet.absoluteFillObject,
});

class VideoLooper extends React.Component {
  constructor(props) {
    super(props);
    this.seek = this.seek.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {};
  }

  setNativeProps(nativeProps) {
    this._root?.setNativeProps(nativeProps);
  }

  _assignRoot = component => {
    this._root = component;
  };

  onLoad(event) {
    if (this.props.onLoad) {
      this.props.onLoad(event.nativeEvent);
    }
  }

  onProgress(event) {
    if (this.props.onProgress) {
      this.props.onProgress(event.nativeEvent);
    }
  }

  onError(event) {
    Sentry.captureException(new Error('Video error'), {
      extra: {
        sources: this.props.sources,
        nativeError: event.nativeEvent,
      },
    });
    if (this.props.onError) {
      this.props.onError(event.nativeEvent);
    }
  }

  seek(to) {
    this.setNativeProps({seek: to});
  }

  render() {
    // Do not use audioOnly prop in the native component as it doesn't work correctly
    const {onLoad, onProgress, onError, style, audioOnly, ...rest} = this.props;
    return (
      <Container style={style}>
        <StyledRNVideoLooper
          ref={this._assignRoot}
          onLoad={this.onLoad}
          onProgress={this.onProgress}
          onError={this.onError}
          volume={1}
          {...rest}
        />
      </Container>
    );
  }
}

export default VideoLooper;
