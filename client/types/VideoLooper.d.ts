// import React from 'react';

export interface VideoLooperProperties extends ViewProps {
  loopSource: String;
  startSource?: String;
  endSource?: String;
  repeat: boolean;
  paused: boolean;
  onLoopEnd?: () => void;
  onEnd?: () => void;
  onReadyForDisplay: () => void;
  onTransition: () => void;
}

export default class VideoLooper extends React.Component<VideoLooperProperties> {
  seek(time: number): void;
}
