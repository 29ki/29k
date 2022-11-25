import {
  ExerciseSlideContentSlide,
  ExerciseSlideHostSlide,
  ExerciseSlideReflectionSlide,
  ExerciseSlideSharingSlide,
} from './generated/Exercise';

export type ExerciseSlide =
  | ExerciseSlideContentSlide
  | ExerciseSlideHostSlide
  | ExerciseSlideReflectionSlide
  | ExerciseSlideSharingSlide;
