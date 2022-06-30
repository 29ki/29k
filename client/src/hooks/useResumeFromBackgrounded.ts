import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';

const useResumeFromBackgrounded = (fn = () => {}) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        fn();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [fn]);
};

export default useResumeFromBackgrounded;
