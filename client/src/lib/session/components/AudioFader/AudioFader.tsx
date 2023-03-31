import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components/native';
import VideoLooper from '../../../components/VideoLooper/VideoLooper';

const AudioOnlyPlayer = styled(VideoLooper)({display: 'none'});

type AudioFaderProps = {
  duration?: number;
  volume?: number;
  paused?: boolean;
  repeat?: boolean;
  source: string;
  isLive?: boolean;
};

const AudioFader: React.FC<AudioFaderProps> = ({
  duration = 5000,
  volume = 1,
  paused,
  repeat,
  source,
  isLive,
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
    <AudioOnlyPlayer
      sources={sources}
      paused={paused}
      volume={currentVolume}
      onLoad={onLoad}
      mixWithOthers={isLive}
    />
  );
};

export default React.memo(AudioFader);
