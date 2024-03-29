import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

import useUserState from '../state/state';
import {getMe} from '../api/user';
import useUser from './useUser';

const useAuthenticateUser = () => {
  const user = useUser();
  const setUserAndClaims = useUserState(state => state.setUserAndClaims);
  const setData = useUserState(state => state.setData);
  const resetUser = useUserState(state => state.reset);

  useEffect(() => {
    const unsubscribe = auth().onUserChanged(async currentUser => {
      if (currentUser === null) {
        resetUser();
      } else {
        const idToken = await currentUser.getIdTokenResult();
        setUserAndClaims({
          user: currentUser,
          claims: idToken.claims,
        });
      }
    });

    return unsubscribe;
  }, [setUserAndClaims, resetUser]);

  useEffect(() => {
    if (user?.uid) {
      getMe().then(setData);
    }
  }, [user?.uid, setData]);
};

export default useAuthenticateUser;
