import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {clone} from 'ramda';

import useUserState from '../state/state';

const useAuthenticateUser = () => {
  const setUser = useUserState(state => state.setUser);
  const resetUser = useUserState(state => state.reset);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged(async currentUser => {
      if (currentUser === null) {
        resetUser();
      } else {
        setUser(clone(currentUser));
      }
    });

    return unsubscribe;
  }, [setUser, resetUser]);
};

export default useAuthenticateUser;
