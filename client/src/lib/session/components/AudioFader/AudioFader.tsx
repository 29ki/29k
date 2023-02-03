import React, {useCallback, useEffect, useState} from 'react';
import Audio from '../../../audio/components/Audio';

type AudioFaderProps = {
  duration?: number;
  volume?: number;
  paused?: boolean;
  repeat?: boolean;
  source: string;
};

const AudioFader = React.memo<AudioFaderProps>(
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

    const onLoad = useCallback(() => setLoaded(true), [setLoaded]);

    return (
      <Audio
        paused={paused}
        repeat={repeat}
        volume={currentVolume}
        onLoad={onLoad}
        source={source}
        mixWithOthers
      />
    );
  },
);

export default AudioFader;
