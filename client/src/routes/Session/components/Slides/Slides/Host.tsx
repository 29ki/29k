import React from 'react';
import useSessionParticipantSpotlight from '../../../hooks/useSessionParticipantSpotlight';
import Participant from '../../Participants/Participant';

type HostProps = {
  active: boolean;
};
const Host: React.FC<HostProps> = ({active}) => {
  const participantSpotlight = useSessionParticipantSpotlight();

  if (!active || !participantSpotlight) {
    return null;
  }

  return <Participant participant={participantSpotlight} isHostSpotlight />;
};

export default Host;
