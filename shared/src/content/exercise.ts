import {Exercise, ExerciseSlideSharingSlide} from '../types/generated/Exercise';

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
