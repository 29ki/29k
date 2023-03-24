import React, {useCallback, useEffect, useMemo, useState} from 'react';
import VideoLooper from '../../../components/VideoLooper/VideoLooper';

type AudioFaderProps = {
  duration?: number;
  volume?: number;
  paused?: boolean;
  repeat?: boolean;
  source: string;
};

const AudioFader: React.FC<AudioFaderProps> = ({
  duration = 5000,
  volume = 1,
  paused,
  repeat,
  source,
}) => {
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

  const sources = useMemo(() => {
    return [{source, repeat}];
  }, [source, repeat]);

  return (
    <VideoLooper
      sources={sources}
      paused={paused}
      volume={currentVolume}
      onReadyForDisplay={onLoad}
      audioOnly
    />
  );
};

export default React.memo(AudioFader);
