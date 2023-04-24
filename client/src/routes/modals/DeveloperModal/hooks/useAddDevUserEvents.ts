import {useCallback} from 'react';
import useUser from '../../../../lib/user/hooks/useUser';
import useUserState from '../../../../lib/user/state/state';

let getDevUserEvents = ({}) => [];

if (__DEV__) {
  getDevUserEvents = require('../utils/getDevUserEvents').default;
}

const useAddDevUserEvents = () => {
  const {setCurrentUserState} = useUserState();
  const user = useUser();

  return useCallback(() => {
    if (user?.uid) {
      const devUserEvents = getDevUserEvents({userId: user?.uid});

      setCurrentUserState(({userEvents = []} = {}) => ({
        userEvents: [...userEvents, ...devUserEvents],
      }));
    }
  }, [setCurrentUserState, user?.uid]);
};

export default useAddDevUserEvents;
