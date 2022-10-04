import {useEffect, useRef, useState} from 'react';
import Sound from 'react-native-sound';

const useAudio = (source: string): Sound | undefined => {
  const currentSource = useRef<string | undefined>();
  const [audio, setAudio] = useState<Sound | undefined>();

  useEffect(() => {
    if (currentSource.current !== source) {
      currentSource.current = source;
      const sound = new Sound(source, '', () => {
        setAudio(sound);
      });
    }

    return () => {
      if (audio) {
        audio.release();
      }
    };
  }, [source, audio]);

  return audio;
};

export default useAudio;
