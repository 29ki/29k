import {
  ExerciseSlideContentSlide,
  ExerciseSlideHostSlideLiveOnly,
  ExerciseSlideReflectionSlideLiveOnly,
  ExerciseSlideSharingSlide,
  ExerciseSlideInstructionSlide,
} from './generated/Exercise';

export type ExerciseSlide =
  | ExerciseSlideContentSlide
  | ExerciseSlideHostSlideLiveOnly
  | ExerciseSlideReflectionSlideLiveOnly
  | ExerciseSlideSharingSlide
  | ExerciseSlideInstructionSlide;
