import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('MultiRoute', true);

const useAudio = (source: string): Sound | undefined => {
  const [audio, setAudio] = useState<Sound | undefined>();

  useEffect(() => {
    const audioInstance = new Sound(source, '', err => {
      if (err) {
        console.error(err);
      }

      Sound.setActive(true);

      setAudio(audioInstance);
    });
  }, [source]);

  useEffect(() => {
    return () => {
      audio?.release();
    };
  }, [audio]);

  return audio;
};

export default useAudio;
