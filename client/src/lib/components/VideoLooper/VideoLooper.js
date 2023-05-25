import React from 'react';
import {requireNativeComponent, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import Sentry from '../../sentry';

const RNVideoLooper = requireNativeComponent('VideoLooper');

const Container = styled.View({
  ...StyleSheet.absoluteFillObject,
  overflow: 'hidden',
  backgroundColor: 'red',
});

const StyledRNVideoLooper = styled(RNVideoLooper)({
  ...StyleSheet.absoluteFillObject,
});

class VideoLooper extends React.Component {
  constructor(props) {
    super(props);
    this.seek = this.seek.bind(this);
    this.onLoad = this.onLoad.bind(this);
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

  onError(event) {
    Sentry.captureMessage(event.nativeEvent.cause);
    if (this.props.onError) {
      this.props.onError(event.nativeEvent);
    }
  }

  seek(to) {
    this.setNativeProps({seek: to});
  }

  render() {
    const {onLoad, onError, style, ...rest} = this.props;
    return (
      <Container style={style}>
        <StyledRNVideoLooper
          ref={this._assignRoot}
          onLoad={this.onLoad}
          onError={this.onError}
          {...rest}
        />
      </Container>
    );
  }
}

export default VideoLooper;
