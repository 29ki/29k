import React, {useState} from 'react';
import RNVideo from 'react-native-video';
import styled from 'styled-components/native';
import {Spacer12} from '../../../../../common/components/Spacers/Spacer';
import Markdown from '../../../../../common/components/Typography/Markdown/Markdown';
import {SPACINGS} from '../../../../../common/constants/spacings';

export type VideoContentType = {
  type: 'video';
  content: {
    source: string;
    text: string;
  };
};

const Wrapper = styled.TouchableOpacity({
  flex: 1,
});

const TextWrapper = styled.View({
  top: SPACINGS.SIXTEEN,
  flexDirection: 'row',
  justifyContent: 'center',
});

const Video = styled(RNVideo)({
  flex: 1,
});

const VideoContent: React.FC<{content: VideoContentType}> = ({content}) => {
  const [isPaused, setIsPaused] = useState(true);
  return (
    <Wrapper onPress={() => setIsPaused(!isPaused)}>
      <Spacer12 />
      <TextWrapper>
        <Markdown>{content.content.text}</Markdown>
      </TextWrapper>
      <Spacer12 />
      <Video source={{uri: content.content.source}} paused={isPaused} />
      <Spacer12 />
    </Wrapper>
  );
};

export default VideoContent;
