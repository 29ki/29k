import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useSetRecoilState} from 'recoil';

import {userAtom} from '../state/state';

const useAuthenticateUser = () => {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user === null) {
        auth().signInAnonymously();
      } else {
        setUser(user);
      }
    });

    return unsubscribe;
  }, [setUser]);
};

export default useAuthenticateUser;
