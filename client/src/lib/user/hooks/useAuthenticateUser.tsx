import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useSetRecoilState} from 'recoil';
import {clone} from 'ramda';

import {userAtom} from '../state/state';

const useAuthenticateUser = () => {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      if (currentUser === null) {
        try {
          await auth().signInAnonymously();
        } catch (err) {
          console.debug('Failed to sign in: ', err);
        }
      } else {
        setUser(clone(currentUser));
      }
    });

    return unsubscribe;
  }, [setUser]);
};

export default useAuthenticateUser;
