import React from 'react';
import DailyProvider from './DailyProvider';
import Lobby from './Lobby/Lobby';
import Session from './Session';

const Video = () => {
  return (
    <DailyProvider>
      <Session />
    </DailyProvider>
  );
};

export default Video;
