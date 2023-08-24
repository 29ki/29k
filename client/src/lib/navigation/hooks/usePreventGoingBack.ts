import {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const usePreventGoingBack = (
  callback?: () => void,
  hasFailed?: boolean,
  isEjected?: boolean,
) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    let unsubscribe = () => {};
    if (isFocused && !hasFailed && !isEjected) {
      unsubscribe = navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        if (callback) {
          callback();
        }
      });
    }
    return unsubscribe;
  }, [callback, navigation, isFocused, hasFailed, isEjected]);
};

export default usePreventGoingBack;
