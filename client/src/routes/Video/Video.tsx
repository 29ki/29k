import React from 'react';
import Daily, {
  DailyEvent,
  DailyMediaView,
} from '@daily-co/react-native-daily-js';

const Video = () => {
  return (
    <DailyMediaView
      videoTrack={participant.videoTrack}
      audioTrack={participant.audioTrack}
      mirror={participant.local}
      zOrder={participant.local ? 1 : 0}
    />
  );
};

export default Video;
