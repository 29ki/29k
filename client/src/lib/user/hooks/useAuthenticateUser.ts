import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {clone} from 'ramda';

import {userAtom} from '../state/state';

const useAuthenticateUser = () => {
  const setUser = useSetRecoilState(userAtom);
  const resetUser = useResetRecoilState(userAtom);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
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
