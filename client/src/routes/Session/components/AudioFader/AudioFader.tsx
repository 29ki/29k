import React, {useCallback, useEffect, useState} from 'react';
import {VideoBase} from '../VideoBase/VideoBase';

type AudioFaderProps = {
  duration?: number;
  volume?: number;
  paused?: boolean;
  repeat?: boolean;
  source: string;
};

const AudioFader: React.FC<AudioFaderProps> = React.memo(
  ({duration = 5000, volume = 1, paused, repeat, source}) => {
    const [currentVolume, setVolume] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const updateVolume = useCallback(
      (step: number) => (v: number) => {
        if (v > volume) {
          return Math.max(v - step, volume);
        } else {
          return Math.min(v + step, volume);
        }
      },
      [volume],
    );

    useEffect(() => {
      const ms = 100;
      const step = ms / duration;

      const interval = setInterval(() => {
        if (loaded && !paused) {
          setVolume(updateVolume(step));
        }
      }, ms);

      return () => clearInterval(interval);
    }, [duration, updateVolume, loaded, paused]);

    return (
      <VideoBase
        audioOnly
        paused={paused}
        repeat={repeat}
        volume={currentVolume}
        onLoad={() => setLoaded(true)}
        source={{uri: source}}
      />
    );
  },
);

export default AudioFader;
