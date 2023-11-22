import {useIsFocused} from '@react-navigation/native';
import throttle from 'lodash.throttle';
import {useMemo, useEffect, EffectCallback, useCallback} from 'react';
import useResumeFromBackgrounded from '../../appState/hooks/useResumeFromBackgrounded';

const useThrottledFocusEffect = (
  effect: EffectCallback,
  delay: number = 5 * 60 * 1000,
) => {
  const isFocused = useIsFocused();

  const throttledEffect = useMemo(() => {
    return throttle(effect, delay, {trailing: false});
  }, [effect, delay]);

  const focusedEffect = useCallback(() => {
    if (isFocused) {
      return throttledEffect();
    }
  }, [throttledEffect, isFocused]);

  useResumeFromBackgrounded(throttledEffect);

  useEffect(focusedEffect, [focusedEffect]);
};

export default useThrottledFocusEffect;
