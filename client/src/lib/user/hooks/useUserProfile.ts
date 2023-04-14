import {useCallback, useEffect, useMemo, useState} from 'react';
import {User} from '../../../../../shared/src/types/User';
import {getUser} from '../api/user';

const useUserProfile = (userId: string | undefined): User | undefined => {
  const [user, setUser] = useState<User>();

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      return;
    }

    setUser(await getUser(userId));
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return useMemo(() => user, [user]);
};

export default useUserProfile;
