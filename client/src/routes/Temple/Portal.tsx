import React from 'react';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import styled from 'styled-components/native';

import useTempleExercise from './hooks/useTempleExercise';

const VideoStyled = styled(Video)({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
});

const Portal: React.FC = () => {
  const exercise = useTempleExercise();
  const introPortal = exercise?.introPortal;

  if (!introPortal) {
    return null;
  }

  return (
    <>
      {introPortal.type === 'video' && (
        <>
          <VideoStyled
            paused
            source={{uri: introPortal.content.videoEnd?.source}}
          />
          <VideoStyled
            onEnd={() => {
              console.log('ended');
            }}
            repeat
            source={{uri: introPortal.content.videoLoop?.source}}
          />
        </>
      )}
    </>
  );
};

export default Portal;
