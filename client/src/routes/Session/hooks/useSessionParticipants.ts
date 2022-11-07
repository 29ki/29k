import {DailyUserData} from '../../../../../shared/src/types/Session';
import useSessionState from '../state/state';
import useDailyState from '../../../lib/daily/state/state';
import useSessionExercise from './useSessionExercise';
import {omit, values} from 'ramda';

const useSessionParticipants = () => {
  const participantsObj = useDailyState(state => state.participants);
  const participantsSortOrder = useDailyState(
    state => state.participantsSortOrder,
  );
  const session = useSessionState(state => state.session);
  const exercise = useSessionExercise();

  const participants = [
    ...participantsSortOrder.map(id => participantsObj[id]),
    ...values(omit(participantsSortOrder, participantsObj)),
  ];

  const inSessionParticipants = participants.filter(
    participant => !(participant.userData as DailyUserData)?.inPortal,
  );

  if (
    !session?.exerciseState.dailySpotlightId ||
    exercise?.slide.current.type !== 'host'
  ) {
    return inSessionParticipants;
  }

  return inSessionParticipants.filter(
    participant =>
      participant.user_id !== session?.exerciseState.dailySpotlightId,
  );
};

export default useSessionParticipants;
