import React from 'react';
import useTempleParticipantSpotlight from '../../../hooks/useTempleParticipantSpotlight';
import Participant from '../../Participants/Participant';

type ParticipantSpotlightProps = {
  active: boolean;
};
const ParticipantSpotlight: React.FC<ParticipantSpotlightProps> = ({
  active,
}) => {
  const participantSpotlight = useTempleParticipantSpotlight();

  if (!active || !participantSpotlight) {
    return null;
  }

  return <Participant participant={participantSpotlight} />;
};

export default ParticipantSpotlight;
