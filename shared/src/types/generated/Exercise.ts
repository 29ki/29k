/* eslint-disable */
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
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseIntroPortalVideoEnd {
  description?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseIntroPortalHostNote {
  text: string;
}

export interface ExerciseIntroPortal {
  videoLoop?: ExerciseIntroPortalVideoLoop;
  videoEnd?: ExerciseIntroPortalVideoEnd;
  hostNotes?: ExerciseIntroPortalHostNote[];
}

export interface ExerciseOutroPortalVideo {
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseOutroPortal {
  video?: ExerciseOutroPortalVideo;
}

export interface ExerciseSlidesContentHostNote {
  text: string;
}

export interface ExerciseSlidesContentContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlidesContentContentVideo {
  autoLoop?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlidesContentContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlidesContentContentImage;
  video?: ExerciseSlidesContentContentVideo;
}

export interface ExerciseSlidesReflectionHostNote {
  text: string;
}

export interface ExerciseSlidesReflectionContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlidesReflectionContentVideo {
  autoLoop?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlidesReflectionContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlidesReflectionContentImage;
  video?: ExerciseSlidesReflectionContentVideo;
}

export interface ExerciseSlidesSharingHostNote {
  text: string;
}

export interface ExerciseSlidesSharingContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlidesSharingContentVideo {
  autoLoop?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlidesSharingContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlidesSharingContentImage;
  video?: ExerciseSlidesSharingContentVideo;
}

export interface ExerciseSlidesHostHostNote {
  text: string;
}

export interface ExerciseSlidesContent {
  type: 'content';
  hostNotes?: ExerciseSlidesContentHostNote[];
  content: ExerciseSlidesContentContent;
}

export interface ExerciseSlidesReflection {
  type: 'reflection';
  hostNotes?: ExerciseSlidesReflectionHostNote[];
  content: ExerciseSlidesReflectionContent;
}

export interface ExerciseSlidesSharing {
  type: 'sharing';
  hostNotes?: ExerciseSlidesSharingHostNote[];
  content: ExerciseSlidesSharingContent;
}

export interface ExerciseSlidesHost {
  type: 'host';
  hostNotes?: ExerciseSlidesHostHostNote[];
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
    | ExerciseSlidesHost
  )[];
}
