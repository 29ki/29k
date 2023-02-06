import React, {useMemo} from 'react';
import {useCallback, useEffect, useState} from 'react';
import {ListRenderItemInfo, SectionListRenderItem} from 'react-native';

import {Session} from '../../../../../shared/src/types/Session';
import {Section} from '../Plan';
import {UserProfile} from '../../../../../shared/src/types/User';
import {CompletedSession} from '../../../lib/user/state/state';

import {getProfile} from '../../../lib/user/api/user';

import Gutters from '../../../lib/components/Gutters/Gutters';
import CompletedSessionCard from '../../../lib/components/Cards/SessionCard/CompletedSessionCard';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';

const SessionCardContainer: SectionListRenderItem<
  Session | CompletedSession,
  Section
> = ({item, section, index}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const standAlone = section.data.length === 1;
  const hasCardBefore = index > 0;
  const hasCardAfter = index !== section.data.length - 1;

  const fetchUserProfile = useCallback(
    async (id: string) => setProfile(await getProfile(id)),
    [],
  );

  useEffect(() => {
    if (item?.hostProfile || profile) {
      return;
    }

    fetchUserProfile(item.hostId);
  }, [fetchUserProfile, item.hostId, item?.hostProfile, profile]);

  const session: Session | CompletedSession = useMemo(() => {
    if (item.hostProfile) {
      return item;
    }

    return {
      ...item,
      hostProfile: profile || undefined,
    };
  }, [profile, item]);

  return (
    <Gutters>
      {(session as CompletedSession).completedAt && (
        <CompletedSessionCard
          session={session as CompletedSession}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}
        />
      )}
      {(session as Session).startTime && (
        <SessionCard
          session={session as Session}
          standAlone={standAlone}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}
        />
      )}
    </Gutters>
  );
};

export default SessionCardContainer;
