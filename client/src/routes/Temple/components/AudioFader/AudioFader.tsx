import React, {useCallback, useEffect, useState} from 'react';
import Audio from '../../../../lib/audio/components/Audio';

type AudioFaderProps = {
  duration?: number;
  muted?: boolean;
  paused?: boolean;
  repeat?: boolean;
  source: string;
};

const AudioFader: React.FC<AudioFaderProps> = ({
  duration = 5000,
  muted = false,
  paused,
  repeat,
  source,
}) => {
  const [volume, setVolume] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const updateVolume = useCallback(
    (step: number) => (v: number) => {
      if (muted && v > 0) {
        return Math.max(v - step, 0);
      } else if (!muted && v < 1) {
        return Math.min(v + step, 1);
      }
      return v;
    },
    [muted],
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
    <Audio
      source={source}
      repeat={repeat}
      volume={volume}
      paused={paused}
      onLoad={() => setLoaded(true)}
    />
  );
};

export default AudioFader;
