import {useEffect} from 'react';
import IdleTimerManager from 'react-native-idle-timer';

const usePreventScreenSleep = (context: string) => {
  useEffect(() => {
    IdleTimerManager.setIdleTimerDisabled(true, context);
    return () => IdleTimerManager.setIdleTimerDisabled(false, context);
  }, [context]);
};

export default usePreventScreenSleep;
