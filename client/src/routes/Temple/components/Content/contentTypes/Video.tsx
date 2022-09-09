import React from 'react';
import RNVideo from 'react-native-video';
import styled from 'styled-components/native';
import {VideoContentType} from '../../../../../../../shared/src/types/Content';
import {Spacer12} from '../../../../../common/components/Spacers/Spacer';
import {H2} from '../../../../../common/components/Typography/Heading/Heading';

const VideoStyled = styled(RNVideo)({
  flex: 1,
});

const Heading = styled(H2)({
  textAlign: 'center',
});

const Video: React.FC<{content: VideoContentType; playing: boolean}> = ({
  content,
  playing,
}) => (
  <>
    <Spacer12 />
    <Heading>{content.content.heading}</Heading>
    <Spacer12 />
    <VideoStyled
      source={{uri: content.content.source}}
      paused={!playing}
      resizeMode="contain"
    />
    <Spacer12 />
  </>
);

export default Video;
