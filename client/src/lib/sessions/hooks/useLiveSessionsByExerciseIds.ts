import {useMemo} from 'react';
import useSessions from './useSessions';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

const useLiveSessionsByExercises = (exercises: Exercise[] = []) => {
  const {sessions} = useSessions();

  return useMemo(() => {
    const exerciseIds = exercises.map(exercise => exercise.id);
    return sessions.filter(session => exerciseIds.includes(session.exerciseId));
  }, [sessions, exercises]);
};

export default useLiveSessionsByExercises;
