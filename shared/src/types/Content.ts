import {
  ExerciseSlideContentSlide,
  ExerciseSlideHostSlide,
  ExerciseSlideReflectionSlide,
  ExerciseSlideSharingSlide,
  ExerciseSlideInstructionSlideAsync,
} from './generated/Exercise';

export type ExerciseSlide =
  | ExerciseSlideContentSlide
  | ExerciseSlideHostSlide
  | ExerciseSlideReflectionSlide
  | ExerciseSlideSharingSlide
  | ExerciseSlideInstructionSlideAsync;
