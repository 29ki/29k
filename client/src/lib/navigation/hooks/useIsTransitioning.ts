import {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {InteractionManager} from 'react-native';

const useIsTransitioning = () => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsTransitioning(false);
      });

      return () => {
        setIsTransitioning(true);
        task.cancel();
      };
    }, [setIsTransitioning]),
  );

  return isTransitioning;
};

export default useIsTransitioning;
