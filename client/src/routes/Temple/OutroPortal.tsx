import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';

import {
  BottomSafeArea,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';
import useTempleExercise from './hooks/useTempleExercise';
import useLeaveTemple from './hooks/useLeaveTemple';
import VideoBase from './components/VideoBase/VideoBase';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';

const VideoStyled = styled(VideoBase)({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
});

const OutroPortal: React.FC = () => {
  const finalVidRef = useRef<Video>(null);
  const exercise = useTempleExercise();
  const leaveTemple = useLeaveTemple(false);

  usePreventGoingBack();

  const outroPortal = exercise?.outroPortal;

  useEffect(() => {
    if (!outroPortal) {
      leaveTemple();
    }
  }, [outroPortal, leaveTemple]);

  if (!outroPortal) {
    return null;
  }
  return (
    <>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <VideoStyled
        ref={finalVidRef}
        onLoad={() => finalVidRef.current?.seek(0)}
        onEnd={leaveTemple}
        source={{uri: outroPortal.video?.source}}
        resizeMode="cover"
        poster={outroPortal.video?.preview}
        posterResizeMode="cover"
        allowsExternalPlayback={false}
      />
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </>
  );
};

export default OutroPortal;
