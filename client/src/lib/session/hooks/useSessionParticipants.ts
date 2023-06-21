import {useMemo} from 'react';
import {DailyUserData} from '../../../../../shared/src/schemas/Session';
import useDailyState from '../../../lib/daily/state/state';
import useSessionExercise from './useLiveSessionSlideState';
import {omit, values} from 'ramda';

const useSessionParticipants = () => {
  const participantsObj = useDailyState(state => state.participants);
  const participantsSortOrder = useDailyState(
    state => state.participantsSortOrder,
  );
  const slideState = useSessionExercise();

  const isHostSlide = slideState?.current.type === 'host';

  return useMemo(() => {
    const participants = [
      ...participantsSortOrder.map(id => participantsObj[id]),
      ...values(omit(participantsSortOrder, participantsObj)),
    ];

    const inSessionParticipants = participants.filter(
      participant =>
        participant && !(participant.userData as DailyUserData)?.inPortal,
    );

    if (isHostSlide) {
      return inSessionParticipants.filter(participant => !participant.owner);
    }

    return inSessionParticipants;
  }, [participantsObj, participantsSortOrder, isHostSlide]);
};

export default useSessionParticipants;
