import useSessionState from '../state/state';
import useDailyState from '../../../lib/daily/state/state';

const useSessionParticipantSpotlight = () => {
  const session = useSessionState(state => state.session);

  const participantSpotlight = useDailyState(
    state => state.participants[session?.exerciseState.dailySpotlightId ?? ''],
  );

  return participantSpotlight;
};

export default useSessionParticipantSpotlight;
