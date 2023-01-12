import useSessionState from '../state/state';
import useDailyState from '../../../lib/daily/state/state';

const useSessionParticipantSpotlight = () => {
  const sessionState = useSessionState(state => state.sessionState);

  const participantSpotlight = useDailyState(
    state => state.participants[sessionState?.dailySpotlightId ?? ''],
  );

  return participantSpotlight;
};

export default useSessionParticipantSpotlight;
