export type ParticipantSpotlightSlide = {
  type: 'participantSpotlight';
};

export type Content = {
  heading?: string;
  video?: {
    source: string;
    thumbnail: string;
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

export type ExerciseSlide =
  | ContentSlide
  | ReflectionSlide
  | SharingSlide
  | ParticipantSpotlightSlide;

export type Exercise = {
  id: string;
  name: string;
  slides: ExerciseSlide[];
};
