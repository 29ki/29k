import {
  ExerciseSlidesContent,
  ExerciseSlidesHost,
  ExerciseSlidesReflection,
  ExerciseSlidesSharing,
} from './generated/Exercise';

export type ExerciseSlide =
  | ExerciseSlidesContent
  | ExerciseSlidesReflection
  | ExerciseSlidesSharing
  | ExerciseSlidesHost;
