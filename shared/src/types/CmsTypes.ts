/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslintdisable */
/* tslint:disable */

export interface ExercisesCardImage {
  description?: string;
  source?: string;
}

export interface ExercisesCard {
  image?: ExercisesCardImage;
}

export type ExercisesThemeTextColorOptions = '#F9F8F4' | '#2E2E2E';

export interface ExercisesTheme {
  textColor?: ExercisesThemeTextColorOptions;
  backgroundColor?: string;
}

export interface ExercisesIntroPortalVideoLoop {
  description?: string;
  audio?: any;
  source?: any;
  preview?: string;
}

export interface ExercisesIntroPortalVideoEnd {
  description?: string;
  audio?: any;
  source?: any;
  preview?: string;
}

export interface ExercisesIntroPortal {
  videoLoop?: ExercisesIntroPortalVideoLoop;
  videoEnd?: ExercisesIntroPortalVideoEnd;
}

export interface ExercisesOutroPortalVideo {
  description?: string;
  audio?: any;
  source?: any;
  preview?: string;
}

export interface ExercisesOutroPortal {
  video?: ExercisesOutroPortalVideo;
}

export interface ExercisesSlidesContentContentImage {
  description?: string;
  source?: string;
}

export interface ExercisesSlidesContentContentVideo {
  description?: string;
  audio?: any;
  source?: any;
  preview?: string;
}

export interface ExercisesSlidesContentContent {
  heading?: string;
  text?: string;
  image?: ExercisesSlidesContentContentImage;
  video?: ExercisesSlidesContentContentVideo;
}

export interface ExercisesSlidesReflectionContentImage {
  description?: string;
  source?: string;
}

export interface ExercisesSlidesReflectionContentVideo {
  description?: string;
  audio?: any;
  source?: any;
  preview?: string;
}

export interface ExercisesSlidesReflectionContent {
  heading?: string;
  text?: string;
  image?: ExercisesSlidesReflectionContentImage;
  video?: ExercisesSlidesReflectionContentVideo;
}

export interface ExercisesSlidesSharingContentImage {
  description?: string;
  source?: string;
}

export interface ExercisesSlidesSharingContentVideo {
  description?: string;
  audio?: any;
  source?: any;
  preview?: string;
}

export interface ExercisesSlidesSharingContent {
  heading?: string;
  text?: string;
  image?: ExercisesSlidesSharingContentImage;
  video?: ExercisesSlidesSharingContentVideo;
}

export interface ExercisesSlidesContent {
  type: 'content';
  content: ExercisesSlidesContentContent;
}

export interface ExercisesSlidesReflection {
  type: 'reflection';
  content: ExercisesSlidesReflectionContent;
}

export interface ExercisesSlidesSharing {
  type: 'sharing';
  content: ExercisesSlidesSharingContent;
}

export interface ExercisesSlidesParticipantSpotlight {
  type: 'participantSpotlight';
  content?: any;
}

export interface Exercises {
  id?: any;
  name: string;
  published: boolean;
  card: ExercisesCard;
  theme?: ExercisesTheme;
  introPortal?: ExercisesIntroPortal;
  outroPortal?: ExercisesOutroPortal;
  slides: (
    | ExercisesSlidesContent
    | ExercisesSlidesReflection
    | ExercisesSlidesSharing
    | ExercisesSlidesParticipantSpotlight
  )[];
}

export type allContributorsrcContributorsContributionsOptions =
  | 'a11y'
  | 'audio'
  | 'blog'
  | 'bug'
  | 'business'
  | 'code'
  | 'content'
  | 'coreTeam'
  | 'data'
  | 'design'
  | 'doc'
  | 'eventOrganizing'
  | 'example'
  | 'financial'
  | 'fundingFinding'
  | 'ideas'
  | 'infra'
  | 'maintenance'
  | 'marketing'
  | 'mentoring'
  | 'people'
  | 'platform'
  | 'plugin'
  | 'projectManagement'
  | 'question'
  | 'research'
  | 'review'
  | 'security'
  | 'talk'
  | 'test'
  | 'tool'
  | 'translation'
  | 'tutorial'
  | 'userExperience'
  | 'userTesting'
  | 'video';

export interface allContributorsrcContributors {
  name: string;
  avatarurl: string;
  profile: string;
  login?: string;
  contributions: allContributorsrcContributorsContributionsOptions[];
}

export interface allContributorsrc {
  contributors: allContributorsrcContributors[];
}
