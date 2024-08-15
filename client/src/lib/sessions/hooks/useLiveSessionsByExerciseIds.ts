import {useMemo} from 'react';
import useSessions from './useSessions';
import {ExerciseWithLanguage} from '../../content/types';

const useLiveSessionsByExercises = (exercises: ExerciseWithLanguage[] = []) => {
  const {sessions} = useSessions();

  return useMemo(() => {
    const exerciseIds = exercises.map(exercise => exercise.id);
    return sessions.filter(session => exerciseIds.includes(session.exerciseId));
  }, [sessions, exercises]);
};

export default useLiveSessionsByExercises;
