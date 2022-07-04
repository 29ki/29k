import React from 'react';
import DailyProvider from './DailyProvider';
import Entrance from './Entrance';
import Session from './Session';

const Video = () => {
  return (
    <DailyProvider>
      <Entrance />
      <Session />
    </DailyProvider>
  );
};

export default Video;
