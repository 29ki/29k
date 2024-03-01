/* eslint-disable */
/* tslint:disable */

export interface CollectionCoCreator {
  name: string;
  url: string;
  image: string;
}

export interface CollectionCardImage {
  description?: string;
  source?: string;
}

export interface CollectionCardLottie {
  description?: string;
  source?: string;
  subtitles?: string;
}

export interface CollectionCard {
  image?: CollectionCardImage;
  imageBackgroundColor?: string;
  lottie?: CollectionCardLottie;
}

export interface Collection {
  id: any;
  name: string;
  description?: string;
  coCreators?: CollectionCoCreator[];
  link?: string;
  card?: CollectionCard;
  tags?: any[];
  sortOrder?: number;
  published: boolean;
  hidden?: boolean;
  locked?: boolean;
  exercises: any[];
}
