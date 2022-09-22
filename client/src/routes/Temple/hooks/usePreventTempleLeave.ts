import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import useLeaveTemple from './useLeaveTemple';

const usePreventTempleLeave = () => {
  const navigation = useNavigation();
  const leaveTemple = useLeaveTemple();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        leaveTemple();
      }),
    [leaveTemple, navigation],
  );
};

export default usePreventTempleLeave;
