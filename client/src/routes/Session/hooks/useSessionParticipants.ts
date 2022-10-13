import {useRecoilValue} from 'recoil';
import {DailyUserData} from '../../../../../shared/src/types/Session';
import {participantsSelector, sessionAtom} from '../state/state';
import useSessionExercise from './useSessionExercise';

const useSessionParticipants = () => {
  const participants = useRecoilValue(participantsSelector);
  const session = useRecoilValue(sessionAtom);
  const exercise = useSessionExercise();

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
