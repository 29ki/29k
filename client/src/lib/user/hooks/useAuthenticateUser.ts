import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

import useUserState from '../state/state';
import {getMe} from '../api/user';

const useAuthenticateUser = () => {
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
        const data = await getMe();
        setData(data);
      }
    });

    return unsubscribe;
  }, [setUserAndClaims, setData, resetUser]);
};

export default useAuthenticateUser;
