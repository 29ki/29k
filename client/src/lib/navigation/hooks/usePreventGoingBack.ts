import {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const usePreventGoingBack = (
  callback?: () => void,
  hasFailed?: boolean,
  hasEjected?: boolean,
) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    let unsubscribe = () => {};
    if (isFocused && !hasFailed && !hasEjected) {
      unsubscribe = navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        if (callback) {
          callback();
        }
      });
    }
    return unsubscribe;
  }, [callback, navigation, isFocused, hasFailed, hasEjected]);
};

export default usePreventGoingBack;
