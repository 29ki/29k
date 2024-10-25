/* eslint-disable */
/* tslint:disable */

export interface ExerciseCoCreator {
  name: string;
  url: string;
  image: string;
}

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
  subtitles?: string;
}

export interface ExerciseCard {
  imageBackgroundColor?: string;
  image?: ExerciseCardImage;
  lottie?: ExerciseCardLottie;
}

export type ExerciseThemeTextColorOptions = '#F9F8F4' | '#2E2E2E';

export interface ExerciseTheme {
  textColor?: ExerciseThemeTextColorOptions;
  backgroundColor?: string;
}

export interface ExerciseIntroPortalVideoLoopP5JsScript {
  code: string;
  lang: string;
}

export interface ExerciseIntroPortalVideoLoop {
  description?: string;
  source?: string;
  preview?: string;
  subtitles?: string;
  p5JsScript: ExerciseIntroPortalVideoLoopP5JsScript;
  audio?: string;
}

export interface ExerciseIntroPortalVideoEnd {
  description?: string;
  source?: string;
  preview?: string;
  subtitles?: string;
}

export type ExerciseIntroPortalTextColorOptions = '#F9F8F4' | '#2E2E2E';

export interface ExerciseIntroPortalHostNote {
  text?: string;
}

export interface ExerciseIntroPortal {
  videoLoop?: ExerciseIntroPortalVideoLoop;
  videoEnd?: ExerciseIntroPortalVideoEnd;
  textColor?: ExerciseIntroPortalTextColorOptions;
  hostNotes?: ExerciseIntroPortalHostNote[];
}

export interface ExerciseOutroPortalVideo {
  description?: string;
  source?: string;
  preview?: string;
  subtitles?: string;
  audio?: string;
}

export interface ExerciseOutroPortal {
  video?: ExerciseOutroPortalVideo;
}

export interface ExerciseSlideContentSlideHostNote {
  text?: string;
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
  subtitles?: string;
  audio?: string;
}

export interface ExerciseSlideContentSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  duration?: number;
  description?: string;
  source?: string;
  subtitles?: string;
  audio?: string;
}

export interface ExerciseSlideContentSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideContentSlideContentImage;
  video?: ExerciseSlideContentSlideContentVideo;
  lottie?: ExerciseSlideContentSlideContentLottie;
}

export interface ExerciseSlideInstructionSlideContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideInstructionSlideContent {
  image?: ExerciseSlideInstructionSlideContentImage;
  heading?: string;
  text?: string;
}

export interface ExerciseSlideReflectionSlideLiveOnlyHostNote {
  text?: string;
}

export interface ExerciseSlideReflectionSlideLiveOnlyContentImage {
  description?: string;
  source?: string;
}

export interface ExerciseSlideReflectionSlideLiveOnlyContentVideo {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  description?: string;
  source?: string;
  preview?: string;
  subtitles?: string;
  audio?: string;
}

export interface ExerciseSlideReflectionSlideLiveOnlyContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  duration?: number;
  description?: string;
  source?: string;
  subtitles?: string;
  audio?: string;
}

export interface ExerciseSlideReflectionSlideLiveOnlyContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideReflectionSlideLiveOnlyContentImage;
  video?: ExerciseSlideReflectionSlideLiveOnlyContentVideo;
  lottie?: ExerciseSlideReflectionSlideLiveOnlyContentLottie;
}

export interface ExerciseSlideSharingSlideHostNote {
  text?: string;
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
  subtitles?: string;
  audio?: string;
}

export interface ExerciseSlideSharingSlideContentLottie {
  autoPlayLoop?: boolean;
  durationTimer?: boolean;
  duration?: number;
  description?: string;
  source?: string;
  subtitles?: string;
  audio?: string;
}

export interface ExerciseSlideSharingSlideContent {
  heading?: string;
  text?: string;
  image?: ExerciseSlideSharingSlideContentImage;
  video?: ExerciseSlideSharingSlideContentVideo;
  lottie?: ExerciseSlideSharingSlideContentLottie;
}

export interface ExerciseSlideSharingSlideSharingVideoVideo {
  description?: string;
  source?: string;
  preview?: string;
  subtitles?: string;
}

export interface ExerciseSlideSharingSlideSharingVideoProfile {
  displayName?: string;
  photoURL?: string;
}

export interface ExerciseSlideSharingSlideSharingVideo {
  video?: ExerciseSlideSharingSlideSharingVideoVideo;
  profile?: ExerciseSlideSharingSlideSharingVideoProfile;
}

export interface ExerciseSlideHostSlideLiveOnlyHostNote {
  text?: string;
}

export interface ExerciseSlideHostSlideLiveOnlyVideo {
  description?: string;
  source?: string;
  preview?: string;
  subtitles?: string;
}

export interface ExerciseSlideContentSlide {
  type: 'content';
  hostNotes?: ExerciseSlideContentSlideHostNote[];
  content?: ExerciseSlideContentSlideContent;
}

export interface ExerciseSlideInstructionSlide {
  type: 'instruction';
  content?: ExerciseSlideInstructionSlideContent;
}

export interface ExerciseSlideReflectionSlideLiveOnly {
  type: 'reflection';
  hostNotes?: ExerciseSlideReflectionSlideLiveOnlyHostNote[];
  content?: ExerciseSlideReflectionSlideLiveOnlyContent;
}

export interface ExerciseSlideSharingSlide {
  type: 'sharing';
  id: string;
  hostNotes?: ExerciseSlideSharingSlideHostNote[];
  content?: ExerciseSlideSharingSlideContent;
  sharingVideos?: ExerciseSlideSharingSlideSharingVideo[];
}

export interface ExerciseSlideHostSlideLiveOnly {
  type: 'host';
  hostNotes?: ExerciseSlideHostSlideLiveOnlyHostNote[];
  video?: ExerciseSlideHostSlideLiveOnlyVideo;
}

export interface Exercise {
  id: any;
  name: string;
  description?: string;
  duration: number;
  coCreators?: ExerciseCoCreator[];
  tags?: any[];
  link?: string;
  published: boolean;
  hidden?: boolean;
  locked?: boolean;
  live?: boolean;
  async?: boolean;
  excludeFromWeb?: boolean;
  socialMeta?: ExerciseSocialMediaMetaTags;
  card: ExerciseCard;
  theme?: ExerciseTheme;
  introPortal?: ExerciseIntroPortal;
  outroPortal?: ExerciseOutroPortal;
  slides: (
    | ExerciseSlideContentSlide
    | ExerciseSlideInstructionSlide
    | ExerciseSlideReflectionSlideLiveOnly
    | ExerciseSlideSharingSlide
    | ExerciseSlideHostSlideLiveOnly
  )[];
}
