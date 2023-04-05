import React, {useMemo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';

import useSessionState from '../../../state/state';

import {ExerciseSlideHostSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Video from './Blocks/Video';
import {COLORS} from '../../../../../../../shared/src/constants/colors';

const VideoWrapper = styled.View({
  height: '100%',
  width: '100%',
});

const BottomGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 80,
});

type HostVideoProps = {
  slide: ExerciseSlideHostSlide;
  active: boolean;
};

const HostVideo: React.FC<HostVideoProps> = ({
  slide: {video = null},
  active,
}) => {
  const theme = useSessionState(state => state.exercise?.theme);
  const background = theme?.backgroundColor ?? COLORS.WHITE;
  const colors = useMemo(
    () => [hexToRgba(background, 0), hexToRgba(background, 1)],
    [background],
  );

  if (!video?.source) {
    return null;
  }

  return (
    <VideoWrapper>
      <Video source={video.source} active={active} preview={video.preview} />
      <BottomGradient colors={colors} />
    </VideoWrapper>
  );
};

export default React.memo(HostVideo);
