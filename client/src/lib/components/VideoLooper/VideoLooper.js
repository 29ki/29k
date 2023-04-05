import React from 'react';
import {requireNativeComponent, StyleSheet} from 'react-native';
import styled from 'styled-components/native';

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

  seek(to) {
    this.setNativeProps({seek: to});
  }

  render() {
    const {onLoad, ...rest} = this.props;
    return (
      <Container>
        <StyledRNVideoLooper
          ref={this._assignRoot}
          onLoad={this.onLoad}
          {...rest}
        />
      </Container>
    );
  }
}

export default VideoLooper;
