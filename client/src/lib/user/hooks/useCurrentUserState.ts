import {useMemo} from 'react';
import useUserState from '../state/state';
import useUser from './useUser';

const useCurrentUserState = () => {
  const user = useUser();
  const userState = useUserState(state => state.userState);
  return useMemo(
    () => (user ? userState[user.uid] : undefined),
    [user, userState],
  );
};

export default useCurrentUserState;
