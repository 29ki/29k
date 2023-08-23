import {useEffect} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const usePreventGoingBack = (callback?: () => void, hasFailed?: boolean) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    let unsubscribe = () => {};
    console.log('****************', hasFailed);
    if (isFocused && !hasFailed) {
      unsubscribe = navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        if (callback) {
          callback();
        }
      });
    }
    return unsubscribe;
  }, [callback, navigation, isFocused, hasFailed]);
};

export default usePreventGoingBack;
