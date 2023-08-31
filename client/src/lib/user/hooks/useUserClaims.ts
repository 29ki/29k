import {equals} from 'ramda';
import {useCallback} from 'react';
import {useStoreWithEqualityFn} from 'zustand/traditional';
import auth from '@react-native-firebase/auth';
import useUserState from '../state/state';

const useUserClaims = () => {
  const claims = useStoreWithEqualityFn(
    useUserState,
    state => state.claims,
    equals,
  );
  const setClaims = useUserState(state => state.setClaims);

  const updateUserClaims = useCallback(
    async (forceRefresh?: boolean) => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdTokenResult(forceRefresh);
        setClaims(idToken.claims);
      }
    },
    [setClaims],
  );

  return {
    claims,
    updateUserClaims,
  };
};

export default useUserClaims;
