import {useCallback} from 'react';
import {Platform} from 'react-native';
import {VolumeManager} from 'react-native-volume-manager';

const useAdjustVolume = () => {
  return useCallback(async () => {
    if (Platform.OS === 'android') {
      const {music, call} = await VolumeManager.getVolume();

      if (call !== music) {
        VolumeManager.setVolume(Math.max(call ?? 0, music ?? 0), {
          type: 'music',
          showUI: false,
        });
        // Set to a sensible default if volumes can't be detrmained
      } else if (call === undefined && music === undefined) {
        VolumeManager.setVolume(0.5, {type: 'music', showUI: false});
      }
    }
  }, []);
};

export default useAdjustVolume;
