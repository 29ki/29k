import React from 'react';
import {useRecoilValue} from 'recoil';
import {participantByIdSelector, templeAtom} from '../../../state/state';
import Participant from '../../Participants/Participant';

const Facilitator = () => {
  const temple = useRecoilValue(templeAtom);

  const facilitator = useRecoilValue(
    participantByIdSelector(temple?.dailyFacilitatorId),
  );

  if (!facilitator) {
    return null;
  }
  return <Participant participant={facilitator} />;
};

export default Facilitator;
