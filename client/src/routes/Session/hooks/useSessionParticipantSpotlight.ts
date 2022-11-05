import {useRecoilValue} from 'recoil';
import {sessionAtom} from '../state/state';
import useDailyState from '../../../lib/daily/state/state';

const useSessionParticipantSpotlight = () => {
  const session = useRecoilValue(sessionAtom);

  const participantSpotlight = useDailyState(
    state => state.participants[session?.exerciseState.dailySpotlightId ?? ''],
  );

  return participantSpotlight;
};

export default useSessionParticipantSpotlight;
