import React from 'react';
import {useCallback, useEffect, useState} from 'react';

import {UserProfile} from '../../../../../shared/src/types/User';

import {getProfile} from '../../../lib/user/api/user';

import Gutters from '../../../lib/components/Gutters/Gutters';
import CompletedSessionCard from '../../../lib/components/Cards/SessionCard/CompletedSessionCard';
import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';

type CompletedSessionCardContainerProps = {
  completedSessionEvent: CompletedSessionEvent;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};

const SessionCardContainer: React.FC<CompletedSessionCardContainerProps> = ({
  completedSessionEvent,
  hasCardBefore,
  hasCardAfter,
}) => {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);

  const fetchUserProfile = useCallback(
    async (id: string) => setProfile(await getProfile(id)),
    [],
  );

  useEffect(() => {
    if (profile || !completedSessionEvent.payload.hostId) {
      return;
    }

    fetchUserProfile(completedSessionEvent.payload.hostId);
  }, [fetchUserProfile, completedSessionEvent.payload.hostId, profile]);

  return (
    <Gutters>
      <CompletedSessionCard
        completedSessionEvent={completedSessionEvent}
        hostProfile={profile}
        hasCardBefore={hasCardBefore}
        hasCardAfter={hasCardAfter}
      />
    </Gutters>
  );
};

export default SessionCardContainer;
