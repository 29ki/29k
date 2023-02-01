import {Exercise} from '../../../../shared/src/types/generated/Exercise';

export const formatInviteCode = (code: number) =>
  (code.toString().match(/\d{1,3}/g) ?? []).join(' ');

export const formatExerciseName = (exercise: Exercise | null) =>
  exercise?.hidden ? `${exercise.name} (WIP)` : exercise?.name;

export const trimSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '');
