import dayjs from 'dayjs';
import {useCallback} from 'react';
import useUserEvents from './useUserEvents';

const useCompletedSessionByTime = () => {
  const {completedSessionEvents} = useUserEvents();
  const getCompletedSessionByExerciseId = useCallback(
    (exerciseId: string, timestamp: string) => {
      const completedSessions = completedSessionEvents
        .filter(
          cse =>
            cse.payload.exerciseId === exerciseId &&
            dayjs(cse.timestamp).isAfter(timestamp),
        )
        .sort((a, b) => (dayjs(a.timestamp).isBefore(b.timestamp) ? -1 : 1));

      return completedSessions.length > 0 ? completedSessions[0] : undefined;
    },
    [completedSessionEvents],
  );

  return {getCompletedSessionByExerciseId};
};

export default useCompletedSessionByTime;
