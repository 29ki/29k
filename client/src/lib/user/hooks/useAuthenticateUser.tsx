import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {useSetRecoilState} from 'recoil';

import {userAtom} from '../state/state';

const useAuthenticateUser = () => {
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser === null) {
        auth().signInAnonymously();
      } else {
        setUser(currentUser);
      }
    });

    return unsubscribe;
  }, [setUser]);
};

export default useAuthenticateUser;
