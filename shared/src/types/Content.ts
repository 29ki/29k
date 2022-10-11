export type HostNote = {
  text: string;
};

export type HostSlide = {
  type: 'host';
  hostNotes?: HostNote[];
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
  hostNotes?: HostNote[];
  content: Content;
};

export type ReflectionSlide = {
  type: 'reflection';
  hostNotes?: HostNote[];
  content: Content;
};

export type SharingSlide = {
  type: 'sharing';
  hostNotes?: HostNote[];
  content: Content;
};

export type IntroPortal = {
  type: 'video';
  hostNotes?: HostNote[];
  videoLoop: {
    source: string;
    audio: string;
    preview: string;
  };
  videoEnd?: {
    source: string;
    preview: string;
  };
};

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
  | HostSlide;

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
