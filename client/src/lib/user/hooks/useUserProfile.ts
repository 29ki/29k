import {useCallback, useEffect, useMemo, useState} from 'react';
import {UserType} from '../../../../../shared/src/schemas/User';
import {getUser} from '../api/user';

const useUserProfile = (userId: string | undefined): UserType | null => {
  const [user, setUser] = useState<UserType | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      return null;
    }

    setUser(await getUser(userId));
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return useMemo(() => user, [user]);
};

export default useUserProfile;
