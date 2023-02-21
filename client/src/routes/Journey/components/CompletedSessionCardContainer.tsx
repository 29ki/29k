import React from 'react';

import Gutters from '../../../lib/components/Gutters/Gutters';
import CompletedSessionCard from '../../../lib/components/Cards/SessionCard/CompletedSessionCard';
import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';

import useUserProfile from '../../../lib/user/hooks/useUserProfile';

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
  const {userProfile} = useUserProfile(completedSessionEvent.payload.hostId);

  return (
    <Gutters>
      <CompletedSessionCard
        completedSessionEvent={completedSessionEvent}
        hostProfile={userProfile}
        hasCardBefore={hasCardBefore}
        hasCardAfter={hasCardAfter}
      />
    </Gutters>
  );
};

export default SessionCardContainer;
