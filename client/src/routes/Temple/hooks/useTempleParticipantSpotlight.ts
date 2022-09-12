import {useRecoilValue} from 'recoil';
import {participantByIdSelector, templeAtom} from '../state/state';

const useTempleParticipantSpotlight = () => {
  const temple = useRecoilValue(templeAtom);

  const participantSpotlight = useRecoilValue(
    participantByIdSelector(temple?.exerciseState.dailySpotlightId),
  );

  return participantSpotlight;
};

export default useTempleParticipantSpotlight;
