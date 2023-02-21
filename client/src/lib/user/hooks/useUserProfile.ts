import {useCallback, useEffect, useState} from 'react';
import {UserProfile} from '../../../../../shared/src/types/User';
import {getProfile} from '../api/user';

const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile>();

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      return;
    }
    setProfile(await getProfile(userId));
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, userId]);

  return profile;
};

export default useUserProfile;
