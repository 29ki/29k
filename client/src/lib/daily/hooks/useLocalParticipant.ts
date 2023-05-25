import {useMemo} from 'react';
import useDailyState from '../state/state';

const useLocalParticipant = () => {
  const participants = useDailyState(state => state.participants);

  return useMemo(
    () =>
      Object.values(participants).find(participant =>
        Boolean(participant?.local),
      ) ?? null,
    [participants],
  );
};

export default useLocalParticipant;
