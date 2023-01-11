import useDailyState from '../../../lib/daily/state/state';

const useSessionHost = () => {
  const participantSpotlight = useDailyState(state => state.participants);

  return Object.values(participantSpotlight).find(p => p.owner);
};

export default useSessionHost;
