import React, {useCallback, useEffect, useImperativeHandle} from 'react';
import Sound, {eventEmitter} from '../../components/Sound/Sound';

type AudioProps = {
  source: string;
  paused?: boolean;
  repeat?: boolean;
  volume?: number;
  mixWithOthers?: boolean;
  onLoad?: (sound: typeof Sound) => void;
};

const Audio = React.forwardRef<typeof Sound | undefined, AudioProps>(
  (
    {
      source,
      paused = false,
      repeat = false,
      volume = 1,
      mixWithOthers = false,
      onLoad,
    },
    ref,
  ) => {
    // Expose sound as ref
    useImperativeHandle(ref, () => Sound, []);

    const onLoadCallback = useCallback(() => {
      if (onLoad) {
        onLoad(Sound);
      }
    }, [onLoad]);

    useEffect(() => {
      eventEmitter.addListener('onLoad', onLoadCallback);
      Sound.prepare(source, !paused, repeat);
    }, [source, paused, repeat, onLoadCallback]);

    useEffect(() => {
      if (onLoad) {
        onLoad(Sound);
      }
    }, [onLoad]);

    useEffect(() => {
      Sound.setRepeat(repeat);
    }, [repeat]);

    useEffect(() => {
      if (paused) {
        Sound.pause();
      } else {
        Sound.play();
      }
    }, [paused]);

    useEffect(() => {
      Sound.setVolume(volume);
    }, [volume]);

    useEffect(() => {
      return () => {
        Sound.release();
      };
    }, []);

    return null;
  },
);

export default React.memo(Audio);
