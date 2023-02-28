import {useCallback, useEffect, useMemo, useState} from 'react';
import {UserProfile} from '../../../../../shared/src/types/User';
import {getProfile} from '../api/user';
import useUser from './useUser';

const useUserProfile = (userId: string | undefined): UserProfile => {
  const user = useUser();
  const isHost = user?.uid === userId;

  const [profile, setProfile] = useState<UserProfile>();

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      return;
    }

    setProfile(await getProfile(userId));
  }, [userId]);

  useEffect(() => {
    if (!isHost) {
      fetchProfile();
    } else {
      setProfile({
        photoURL: user?.photoURL || undefined,
        displayName: user?.displayName || undefined,
      });
    }
  }, [fetchProfile, userId, isHost, user?.displayName, user?.photoURL]);

  return useMemo(
    () => ({
      photoURL: profile?.photoURL,
      displayName: profile?.displayName,
    }),
    [profile?.displayName, profile?.photoURL],
  );
};

export default useUserProfile;
