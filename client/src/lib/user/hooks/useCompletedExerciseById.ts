import {useMemo} from 'react';
import useUserEvents from './useUserEvents';

const useCompletedExerciseById = (exerciseId?: string) => {
  const {completedSessionEvents} = useUserEvents();

  return useMemo(() => {
    if (exerciseId && completedSessionEvents) {
      return completedSessionEvents.find(
        cs => cs.payload.exerciseId === exerciseId,
      );
    }
  }, [exerciseId, completedSessionEvents]);
};

export default useCompletedExerciseById;
