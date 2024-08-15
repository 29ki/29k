import {useCallback} from 'react';
import IdleTimerManager from 'react-native-idle-timer';

const useIdleTimerManager = () =>
  useCallback((active: boolean) => {
    IdleTimerManager.setIdleTimerDisabled(active);
    return () => IdleTimerManager.setIdleTimerDisabled(false);
  }, []);

export default useIdleTimerManager;
