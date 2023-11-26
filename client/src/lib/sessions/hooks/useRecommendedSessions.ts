import {uniq} from 'ramda';
import dayjs from 'dayjs';
import {useMemo} from 'react';
import useSessions from './useSessions';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useGetExercisesByCollectionId from '../../content/hooks/useGetExercisesByCollectionId';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useExercises from '../../content/hooks/useExercises';
import useCompletedSessionByTime from '../../user/hooks/useCompletedSessionByTime';

const useRecommendedSessions = () => {
  const {pinnedSessions, hostedSessions} = useSessions();
  const {pinnedCollections} = usePinnedCollections();
  const getExercisesByCollectionId = useGetExercisesByCollectionId();
  const {getCompletedSessionByExerciseId} = useCompletedSessionByTime();
  const allExercises = useExercises();

  // All pinned and hosted sessions
  const committedSessions = useMemo(
    () => uniq([...pinnedSessions, ...hostedSessions]),
    [pinnedSessions, hostedSessions],
  );

  // Split today and future sessions
  const sessionsToday = useMemo(
    () =>
      committedSessions.filter(session => dayjs(session.startTime).isToday()),
    [committedSessions],
  );

  // All incomplete sessions from pinned collections
  const collectionExercises = useMemo(
    () =>
      pinnedCollections.reduce<Exercise[]>(
        (exercises, collection) => [
          ...exercises,
          ...getExercisesByCollectionId(collection.id)
            .filter(
              exercise =>
                // Filter out exercises that have been completed
                !getCompletedSessionByExerciseId(
                  exercise.id,
                  collection.startedAt,
                ),
            )
            .slice(0, 1), // Only return one exercise per collection
        ],
        [],
      ),
    [
      pinnedCollections,
      getExercisesByCollectionId,
      getCompletedSessionByExerciseId,
    ],
  );

  const randomExercises = useMemo(
    () => allExercises.sort(() => Math.random() - 0.5).slice(0, 5),
    [allExercises],
  );

  return useMemo(
    () =>
      uniq([
        ...sessionsToday,
        ...collectionExercises,
        ...randomExercises,
      ]).slice(0, 5), // Only five recommended sessions
    [sessionsToday, collectionExercises, randomExercises],
  );
};

export default useRecommendedSessions;
