import React, {useCallback, useEffect, useState} from 'react';
import Audio from '../../../../lib/audio/components/Audio';

type AudioFaderProps = {
  duration?: number;
  mute?: boolean;
  paused?: boolean;
  repeat?: boolean;
  source: string;
};

const AudioFader: React.FC<AudioFaderProps> = ({
  duration = 5000,
  mute = false,
  paused,
  repeat,
  source,
}) => {
  const [volume, setVolume] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const updateVolume = useCallback(
    (step: number) => (v: number) => {
      if (mute && v > 0) {
        return v - step < 0 ? 0 : v - step;
      } else if (!mute && v < 1) {
        return v + step > 1 ? 1 : v + step;
      }
      return v;
    },
    [mute],
  );

  useEffect(() => {
    const ms = 100;
    const step = ms / duration;

    const interval = setInterval(() => {
      if (loaded) {
        setVolume(updateVolume(step));
      }
    }, ms);

    return () => clearInterval(interval);
  }, [mute, duration, updateVolume, loaded]);

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
