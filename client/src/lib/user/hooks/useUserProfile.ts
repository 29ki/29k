import {useCallback, useEffect, useMemo, useState} from 'react';
import {User} from '../../../../../shared/src/schemas/User';
import {getUser} from '../api/user';

const useUserProfile = (userId: string | undefined): User | null => {
  const [user, setUser] = useState<User | null>(null);

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
