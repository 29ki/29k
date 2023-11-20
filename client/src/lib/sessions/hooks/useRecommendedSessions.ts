import {useMemo} from 'react';
import useSessions from './useSessions';
import {uniq} from 'ramda';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useGetExercisesByCollectionId from '../../content/hooks/useGetExercisesByCollectionId';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useCompletedSessions from '../../user/hooks/useCompletedSessions';

const useRecommendedSessions = () => {
  const {pinnedSessions, hostedSessions} = useSessions();
  const {pinnedCollections} = usePinnedCollections();
  const getExercisesByCollectionId = useGetExercisesByCollectionId();
  const {completedSessions} = useCompletedSessions();

  const collectionExercises = useMemo(
    () =>
      pinnedCollections
        .reduce<Exercise[]>(
          (exercises, collection) => [
            ...exercises,
            ...getExercisesByCollectionId(collection.id),
          ],
          [],
        )
        .filter(
          exercise =>
            !completedSessions.some(
              session => session.payload.exerciseId === exercise.id,
            ),
        ),
    [pinnedCollections, getExercisesByCollectionId, completedSessions],
  );

  return useMemo(
    () => uniq([...pinnedSessions, ...hostedSessions, ...collectionExercises]),
    [pinnedSessions, hostedSessions, collectionExercises],
  );
};

export default useRecommendedSessions;
