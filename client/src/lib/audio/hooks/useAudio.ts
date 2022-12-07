import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';

const useAudio = (source: string): Sound | undefined => {
  const [audio, setAudio] = useState<Sound | undefined>();

  useEffect(() => {
    const audioInstance = new Sound(source, '', err => {
      if (err) {
        console.error(err);
      }

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
