import useDailyState from '../state/state';

const useLocalParticipant = () => {
  const participants = useDailyState(state => state.participants);

  return (
    Object.values(participants).find(participant =>
      Boolean(participant?.local),
    ) ?? null
  );
};

export default useLocalParticipant;
