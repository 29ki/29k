import React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {ListRenderItemInfo} from 'react-native';

import {Session} from '../../../../../shared/src/types/Session';

import Gutters from '../../../lib/components/Gutters/Gutters';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import Byline from '../../../lib/components/Bylines/Byline';

import {getProfile} from '../../../lib/user/api/user';
import {UserProfile} from '../../../../../shared/src/types/User';

const SessionCard = ({item}: ListRenderItemInfo<Session>) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = useCallback(
    async (id: string) => setProfile(await getProfile(id)),
    [],
  );

  useEffect(() => {
    fetchUserProfile(item.hostId);
  }, [fetchUserProfile, item.hostId]);

  return (
    <Gutters>
      <Body16>- {item.id}</Body16>
      <Byline pictureURL={profile?.photoURL} name={profile?.displayName} />
    </Gutters>
  );
};

export default SessionCard;
