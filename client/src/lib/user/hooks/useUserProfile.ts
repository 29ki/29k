import {useMemo} from 'react';
import {UserProfile} from '../../../../../shared/src/types/User';
import useGet from '../../apiClient/useGet';
import useUser from './useUser';

const USER_ENDPOINT = '/user';

const useUserProfile = (userId: string | undefined) => {
  const user = useUser();
  const ownProfile = useMemo(
    () => ({
      displayName: user?.displayName ?? undefined,
      photoURL: user?.photoURL ?? undefined,
    }),
    [user?.displayName, user?.photoURL],
  );
  const isHost = user?.uid !== userId;
  const {data: userProfile} = useGet<UserProfile>(
    `${USER_ENDPOINT}/${userId}`,
    {
      abort: isHost,
    },
  );

  return user?.uid === userId ? ownProfile : userProfile;
};

export default useUserProfile;
