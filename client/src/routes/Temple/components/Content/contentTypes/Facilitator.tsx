import React, {useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  participantByIdSelector,
  spotlightParticipantIdAtom,
  templeAtom,
} from '../../../state/state';
import Participant from '../../Participants/Participant';

const Facilitator = () => {
  const temple = useRecoilValue(templeAtom);

  const facilitator = useRecoilValue(
    participantByIdSelector(temple?.dailyFacilitatorId),
  );
  const setSpotlightParticipantId = useSetRecoilState(
    spotlightParticipantIdAtom,
  );

  useEffect(() => {
    if (facilitator?.user_id) {
      setSpotlightParticipantId(facilitator.user_id);
    }

    return () => setSpotlightParticipantId(null);
  }, [setSpotlightParticipantId, facilitator?.user_id]);

  if (!facilitator) {
    return null;
  }

  return <Participant participant={facilitator} />;
};

export default Facilitator;
