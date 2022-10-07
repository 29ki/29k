import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const usePreventGoingBack = (callback?: () => void) => {
  const navigation = useNavigation();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        if (callback) {
          callback();
        }
      }),
    [callback, navigation],
  );
};

export default usePreventGoingBack;
