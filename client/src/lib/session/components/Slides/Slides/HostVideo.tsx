import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

import {ExerciseSlideHostSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Video from './Blocks/Video';

const VideoWrapper = styled.View({
  height: '100%',
  width: '100%',
});

type HostVideoProps = {
  slide: ExerciseSlideHostSlide;
  active: boolean;
};
const HostVideo: React.FC<HostVideoProps> = ({
  slide: {video = null},
  active,
}) => {
  const videoSource = useMemo(() => ({uri: video?.source}), [video?.source]);

  if (!video) {
    return null;
  }

  return (
    <VideoWrapper>
      <Video source={videoSource} active={active} preview={video.preview} />
    </VideoWrapper>
  );
};

export default HostVideo;
