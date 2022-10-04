import React, {useEffect, useState} from 'react';
import Audio from '../../../../lib/audio/components/Audio';

type AudioFaderProps = {
  duration?: number;
  fadeOut?: boolean;
  paused?: boolean;
  repeat?: boolean;
  source: string;
};

const AudioFader: React.FC<AudioFaderProps> = ({
  duration = 5000,
  fadeOut = false,
  paused,
  repeat,
  source,
}) => {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const ms = 100;
    const step = ms / duration;

    const interval = setInterval(() => {
      if (fadeOut) {
        setVolume(v => (v - step < 0 ? 0 : v - step));
      }
    }, ms);

    return () => clearInterval(interval);
  }, [fadeOut, duration]);

  return (
    <Audio source={source} repeat={repeat} volume={volume} paused={paused} />
  );
};

export default AudioFader;
