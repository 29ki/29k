import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties} from 'react-native-video';
import {useRecoilValue} from 'recoil';

import {templeExerciseStateSelector} from '../../../../state/state';

const StyledVideo = styled(RNVideo)({
  flex: 1,
});

type VideoProps = {
  source: VideoProperties['source'];
  active: boolean;
};
const Video: React.FC<VideoProps> = ({active, source}) => {
  const videoRef = useRef<RNVideo>(null);
  const [loaded, setLoaded] = useState(false);
  const exerciseState = useRecoilValue(templeExerciseStateSelector);
  const previousState = useRef({playing: false, timestamp: new Date()});

  useEffect(() => {
    if (active && loaded && exerciseState) {
      // Block is active, video and state is loaded
      const playing = exerciseState.playing;
      const timestamp = exerciseState.timestamp.toDate();

      if (
        timestamp > previousState.current.timestamp &&
        previousState.current.playing === playing
      ) {
        // State is equal, but newer - reset to beginning
        videoRef.current?.seek(0);
      } else if (timestamp < previousState.current.timestamp) {
        // State is old - compensate time played
        videoRef.current?.seek(
          (new Date().getTime() - timestamp.getTime()) / 1000,
        );
      }

      // Update previous state
      previousState.current = {
        playing,
        timestamp,
      };
    }
  }, [active, loaded, previousState, exerciseState]);

  return (
    <StyledVideo
      source={source}
      ref={videoRef}
      onLoad={() => setLoaded(true)}
      resizeMode="contain"
      paused={!active || !exerciseState?.playing}
      ignoreSilentSwitch="ignore"
      mixWithOthers="mix"
    />
  );
};

export default Video;
