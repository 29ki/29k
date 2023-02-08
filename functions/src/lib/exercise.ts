import {
  Exercise,
  ExerciseSlideSharingSlide,
} from '../../../shared/src/types/generated/Exercise';
import i18next, {DEFAULT_LANGUAGE_TAG, LANGUAGE_TAG} from './i18n';

export const getExerciseById = (
  exerciseId: Exercise['id'],
  language: LANGUAGE_TAG = DEFAULT_LANGUAGE_TAG,
) => {
  const exercise = i18next.t(exerciseId, {
    lng: language,
    ns: 'exercises',
    returnObjects: true,
  }) as Exercise | string;

  if (typeof exercise === 'object') {
    return exercise;
  }

  return;
};

export const getSharingSlideById = (
  exercise: Exercise | undefined,
  sharingId: string,
) => {
  return exercise?.slides
    .filter(s => s.type === 'sharing')
    .find(s => (s as ExerciseSlideSharingSlide)?.id === sharingId) as
    | ExerciseSlideSharingSlide
    | undefined;
};
