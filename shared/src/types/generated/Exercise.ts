/* eslintdisable */
/* tslint:disable */

export interface ExerciseCardImage {
  description?: string;
  source?: string;
}

export interface ExerciseCard {
  image?: ExerciseCardImage;
}

export type ExerciseThemeTextColorOptions = '#F9F8F4' | '#2E2E2E';

export interface ExerciseTheme {
  textColor?: ExerciseThemeTextColorOptions;
  backgroundColor?: string;
}

export interface ExerciseIntroPortalVideoLoop {
  description?: string;
  audio?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseIntroPortalVideoEnd {
  description?: string;
  audio?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseIntroPortal {
  videoLoop?: ExerciseIntroPortalVideoLoop;
  videoEnd?: ExerciseIntroPortalVideoEnd;
}

export interface ExerciseOutroPortalVideo {
  description?: string;
  audio?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseOutroPortal {
  video?: ExerciseOutroPortalVideo;
}

export interface ExerciseSlidesContentContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlidesContentContentVideo {
  description?: string;
  audio?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseSlidesContentContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlidesContentContentImage;
  video?: ExerciseSlidesContentContentVideo;
}

export interface ExerciseSlidesReflectionContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlidesReflectionContentVideo {
  description?: string;
  audio?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseSlidesReflectionContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlidesReflectionContentImage;
  video?: ExerciseSlidesReflectionContentVideo;
}

export interface ExerciseSlidesSharingContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlidesSharingContentVideo {
  description?: string;
  audio?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseSlidesSharingContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlidesSharingContentImage;
  video?: ExerciseSlidesSharingContentVideo;
}

export interface ExerciseSlidesContent {
  type: 'content';
  content: ExerciseSlidesContentContent;
}

export interface ExerciseSlidesReflection {
  type: 'reflection';
  content: ExerciseSlidesReflectionContent;
}

export interface ExerciseSlidesSharing {
  type: 'sharing';
  content: ExerciseSlidesSharingContent;
}

export interface ExerciseSlidesParticipantSpotlight {
  type: 'participantSpotlight';
  content?: any;
}

export interface Exercise {
  id?: any;
  name: string;
  published: boolean;
  card: ExerciseCard;
  theme?: ExerciseTheme;
  introPortal?: ExerciseIntroPortal;
  outroPortal?: ExerciseOutroPortal;
  slides: (
    | ExerciseSlidesContent
    | ExerciseSlidesReflection
    | ExerciseSlidesSharing
    | ExerciseSlidesParticipantSpotlight
  )[];
}
