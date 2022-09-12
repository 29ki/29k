import React from 'react';
import useTempleParticipantSpotlight from '../../../hooks/useTempleParticipantSpotlight';
import Participant from '../../Participants/Participant';

const ParticipantSpotlight = () => {
  const participantSpotlight = useTempleParticipantSpotlight();

  if (!participantSpotlight) {
    return null;
  }

  return <Participant participant={participantSpotlight} />;
};

export default ParticipantSpotlight;
