import {
  ExerciseSlideContentSlide,
  ExerciseSlideHostSlide,
  ExerciseSlideReflectionSlide,
  ExerciseSlideSharingSlide,
  ExerciseSlideTextSlide,
} from './generated/Exercise';

export type ExerciseSlide =
  | ExerciseSlideContentSlide
  | ExerciseSlideHostSlide
  | ExerciseSlideReflectionSlide
  | ExerciseSlideSharingSlide
  | ExerciseSlideTextSlide;
