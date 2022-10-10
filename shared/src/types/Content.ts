export type ParticipantSpotlightSlide = {
  type: 'participantSpotlight';
};

export type Content = {
  heading?: string;
  text?: string;
  video?: {
    source: string;
    preview: string;
  };
  image?: {
    source: string;
    description: string;
  };
};

export type ContentSlide = {
  type: 'content';
  content: Content;
};

export type ReflectionSlide = {
  type: 'reflection';
  content: Content;
};

export type SharingSlide = {
  type: 'sharing';
  content: Content;
};

export type VideoPortal = {
  type: 'video';
  videoLoop: {
    source: string;
    audio: string;
    preview: string;
  };
  videoEnd?: {
    source: string;
    audio: string;
    preview: string;
  };
};

export type IntroPortal = VideoPortal;

export type OutroPortal = {
  type: 'video';
  video: {
    source: string;
    preview: string;
  };
};

export type ExerciseSlide =
  | ContentSlide
  | ReflectionSlide
  | SharingSlide
  | ParticipantSpotlightSlide;

export type Exercise = {
  id: string;
  name: string;
  card?: {
    image?: {source: string; description?: string};
  };
  introPortal: IntroPortal;
  outroPortal: OutroPortal;
  theme?: {
    textColor: string;
    backgroundColor: string;
  };
  slides: ExerciseSlide[];
  published: boolean;
};
