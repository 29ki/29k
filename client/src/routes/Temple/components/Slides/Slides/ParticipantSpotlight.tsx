import React from 'react';
import {useRecoilValue} from 'recoil';
import {participantByIdSelector, templeAtom} from '../../../state/state';
import Participant from '../../Participants/Participant';

const ParticipantSpotlight = () => {
  const temple = useRecoilValue(templeAtom);

  const participantSpotlight = useRecoilValue(
    participantByIdSelector(temple?.dailySpotlightId),
  );

  if (!participantSpotlight) {
    return null;
  }

  return <Participant participant={participantSpotlight} />;
};

export default ParticipantSpotlight;
