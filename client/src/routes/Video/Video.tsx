import React from 'react';
import DailyProvider from './DailyProvider';
import Session from './Session';

const Video = () => {
  return (
    <DailyProvider>
      <Session />
    </DailyProvider>
  );
};

export default Video;
