import {useRecoilValue} from 'recoil';
import {participantByIdSelector, sessionAtom} from '../state/state';

const useSessionParticipantSpotlight = () => {
  const session = useRecoilValue(sessionAtom);

  const participantSpotlight = useRecoilValue(
    participantByIdSelector(session?.exerciseState.dailySpotlightId),
  );

  return participantSpotlight;
};

export default useSessionParticipantSpotlight;
