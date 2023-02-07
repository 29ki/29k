import React from 'react';
import {useCallback, useEffect, useState} from 'react';

import {UserProfile} from '../../../../../shared/src/types/User';
import {CompletedSession} from '../../../lib/user/state/state';

import {getProfile} from '../../../lib/user/api/user';

import Gutters from '../../../lib/components/Gutters/Gutters';
import CompletedSessionCard from '../../../lib/components/Cards/SessionCard/CompletedSessionCard';

type CompletedSessionCardContainerProps = {
  session: CompletedSession;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};

const SessionCardContainer: React.FC<CompletedSessionCardContainerProps> = ({
  session,
  hasCardBefore,
  hasCardAfter,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = useCallback(
    async (id: string) => setProfile(await getProfile(id)),
    [],
  );

  useEffect(() => {
    if (profile || !session.hostId) {
      return;
    }

    fetchUserProfile(session.hostId);
  }, [fetchUserProfile, session.hostId, profile]);

  return (
    <Gutters>
      <CompletedSessionCard
        session={session}
        hostProfile={profile}
        hasCardBefore={hasCardBefore}
        hasCardAfter={hasCardAfter}
      />
    </Gutters>
  );
};

export default SessionCardContainer;
