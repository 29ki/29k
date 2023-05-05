import {
  ExerciseSlideContentSlide,
  ExerciseSlideHostSlide,
  ExerciseSlideReflectionSlide,
  ExerciseSlideSharingSlide,
  ExerciseSlideInstructionSlide,
} from './generated/Exercise';

export type ExerciseSlide =
  | ExerciseSlideContentSlide
  | ExerciseSlideHostSlide
  | ExerciseSlideReflectionSlide
  | ExerciseSlideSharingSlide
  | ExerciseSlideInstructionSlide;
