import {useRecoilValue} from 'recoil';
import {participantsSelector, templeAtom} from '../state/state';
import useTempleExercise from './useTempleExercise';

const useTempleParticipants = () => {
  const participants = useRecoilValue(participantsSelector);
  const temple = useRecoilValue(templeAtom);
  const exercise = useTempleExercise();

  if (
    !temple?.dailySpotlightId ||
    exercise?.slide.current.type !== 'participantSpotlight'
  ) {
    return participants;
  }

  return participants.filter(
    participant => participant.user_id !== temple.dailySpotlightId,
  );
};

export default useTempleParticipants;
