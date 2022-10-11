import {useRecoilValue} from 'recoil';
import {DailyUserData} from '../../../../../shared/src/types/Temple';
import {participantsSelector, templeAtom} from '../state/state';
import useTempleExercise from './useTempleExercise';

const useTempleParticipants = () => {
  const participants = useRecoilValue(participantsSelector);
  const temple = useRecoilValue(templeAtom);
  const exercise = useTempleExercise();

  const inSessionParticipants = participants.filter(
    participant => !(participant.userData as DailyUserData)?.inPortal,
  );

  if (
    !temple?.exerciseState.dailySpotlightId ||
    exercise?.slide.current.type !== 'host'
  ) {
    return inSessionParticipants;
  }

  return inSessionParticipants.filter(
    participant =>
      participant.user_id !== temple?.exerciseState.dailySpotlightId,
  );
};

export default useTempleParticipants;
