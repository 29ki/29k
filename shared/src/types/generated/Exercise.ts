/* eslint-disable */
/* tslint:disable */

export interface ExerciseSocialMediaMetaTags {
  title?: string;
  description?: string;
  image?: string;
}

export interface ExerciseCardImage {
  description?: string;
  source?: string;
}

export interface ExerciseCardLottie {
  description?: string;
  source?: string;
}

export interface ExerciseCardHost {
  displayName?: string;
  photoURL?: string;
}

export interface ExerciseCard {
  image?: ExerciseCardImage;
  lottie?: ExerciseCardLottie;
  host?: ExerciseCardHost;
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
  text?: string;
  asyncText?: string;
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

export interface ExerciseSlideContentSlideHostNote {
  text?: string;
  asyncText?: string;
}

export interface ExerciseSlideContentSlideContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideContentSlideContentVideo {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlideContentSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  audio?: string;
  duration?: number;
}

export interface ExerciseSlideContentSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideContentSlideContentImage;
  video?: ExerciseSlideContentSlideContentVideo;
  lottie?: ExerciseSlideContentSlideContentLottie;
}

export interface ExerciseSlideReflectionSlideHostNote {
  text?: string;
  asyncText?: string;
}

export interface ExerciseSlideReflectionSlideContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideReflectionSlideContentVideo {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlideReflectionSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  audio?: string;
  duration?: number;
}

export interface ExerciseSlideReflectionSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideReflectionSlideContentImage;
  video?: ExerciseSlideReflectionSlideContentVideo;
  lottie?: ExerciseSlideReflectionSlideContentLottie;
}

export interface ExerciseSlideSharingSlideHostNote {
  text?: string;
  asyncText?: string;
}

export interface ExerciseSlideSharingSlideContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideSharingSlideContentVideo {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  audio?: string;
}

export interface ExerciseSlideSharingSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  audio?: string;
  duration?: number;
}

export interface ExerciseSlideSharingSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideSharingSlideContentImage;
  video?: ExerciseSlideSharingSlideContentVideo;
  lottie?: ExerciseSlideSharingSlideContentLottie;
}

export interface ExerciseSlideHostSlideHostNote {
  text?: string;
  asyncText?: string;
}

export interface ExerciseSlideHostSlideVideo {
  description?: string;
  source?: string;
  preview?: string;
}

export interface ExerciseSlideContentSlide {
  type: 'content';
  hostNotes?: ExerciseSlideContentSlideHostNote[];
  content?: ExerciseSlideContentSlideContent;
}

export interface ExerciseSlideReflectionSlide {
  type: 'reflection';
  hostNotes?: ExerciseSlideReflectionSlideHostNote[];
  content?: ExerciseSlideReflectionSlideContent;
}

export interface ExerciseSlideSharingSlide {
  type: 'sharing';
  id: string;
  hostNotes?: ExerciseSlideSharingSlideHostNote[];
  content?: ExerciseSlideSharingSlideContent;
}

export interface ExerciseSlideHostSlide {
  type: 'host';
  hostNotes?: ExerciseSlideHostSlideHostNote[];
  video?: ExerciseSlideHostSlideVideo;
}

export interface Exercise {
  id: any;
  name: string;
  description?: string;
  duration: number;
  tags?: any[];
  published: boolean;
  hidden?: boolean;
  async?: boolean;
  socialMeta?: ExerciseSocialMediaMetaTags;
  card?: ExerciseCard;
  theme?: ExerciseTheme;
  introPortal?: ExerciseIntroPortal;
  outroPortal?: ExerciseOutroPortal;
  slides: (
    | ExerciseSlideContentSlide
    | ExerciseSlideReflectionSlide
    | ExerciseSlideSharingSlide
    | ExerciseSlideHostSlide
  )[];
}
