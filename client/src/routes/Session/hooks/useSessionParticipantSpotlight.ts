import {useRecoilValue} from 'recoil';
import {sessionAtom} from '../state/state';
import {participantByIdSelector} from '../../../lib/daily/state/state';

const useSessionParticipantSpotlight = () => {
  const session = useRecoilValue(sessionAtom);

  const participantSpotlight = useRecoilValue(
    participantByIdSelector(session?.exerciseState.dailySpotlightId),
  );

  return participantSpotlight;
};

export default useSessionParticipantSpotlight;
