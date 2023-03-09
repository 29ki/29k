import {useCallback, useEffect} from 'react';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import * as sessionsCountApi from '../api/sessionsCount';
import useSessionsState from '../state/state';

const useCompletedSessionsCount = () => {
  const setCompletedSessionsCount = useSessionsState(
    state => state.setCompletedSessionsCount,
  );
  const completedSessionsCount = useSessionsState(
    state => state.completedSessionsCount,
  );

  const fetchCompletedSessionsCount = useCallback(async () => {
    setCompletedSessionsCount(
      await sessionsCountApi.fetchCompletedSessionsCount(),
    );
  }, [setCompletedSessionsCount]);

  useEffect(() => {
    if (completedSessionsCount === null) {
      fetchCompletedSessionsCount();
    }
  }, [completedSessionsCount, fetchCompletedSessionsCount]);

  const getCompletedSessionsCountByExerciseId = useCallback(
    (exerciseId: string) => {
      return completedSessionsCount
        ?.filter(cs => cs.exerciseId === exerciseId)
        .reduce(
          (sum, count) =>
            sum + count.asyncCount + count.privateCount + count.publicCount,
          0,
        );
    },
    [completedSessionsCount],
  );

  const getCompletedSessionsCountByCollection = useCallback(
    (collection: Collection) => {
      return collection.exercises.reduce(
        (sum, exerciseId) =>
          sum + getCompletedSessionsCountByExerciseId(exerciseId),
        0,
      );
    },
    [getCompletedSessionsCountByExerciseId],
  );

  return {
    getCompletedSessionsCountByExerciseId,
    getCompletedSessionsCountByCollection,
  };
};

export default useCompletedSessionsCount;
