import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

import useUserState from '../state/state';

const useAuthenticateUser = () => {
  const setUserAndClaims = useUserState(state => state.setUserAndClaims);
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
};

export default useAuthenticateUser;
