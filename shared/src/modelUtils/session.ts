import {
  ExerciseState,
  ExerciseStateData,
  Session,
  SessionData,
} from '../types/Session';

const getSessionExerciseState = (
  exerciseState: ExerciseStateData,
): ExerciseState => ({
  ...exerciseState,
  timestamp: exerciseState.timestamp.toDate().toISOString(),
});

export const getSession = (session: SessionData): Session => ({
  ...session,
  exerciseState: getSessionExerciseState(session.exerciseState),
  startTime: session.startTime.toDate().toISOString(),
  createdAt: session.createdAt.toDate().toISOString(),
  updatedAt: session.updatedAt.toDate().toISOString(),
});
