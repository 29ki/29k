/* eslint-disable */
/* tslint:disable */

export interface CollectionImage {
  description?: string;
  source?: string;
}

export interface CollectionCardBackgroundColors {
  color: string;
}

export interface CollectionCard {
  description?: string;
  backgroundColorGradient?: CollectionCardBackgroundColors[];
  textColor?: string;
}

export interface Collection {
  id: any;
  name: string;
  description?: string;
  link?: string;
  image?: CollectionImage;
  tags?: any[];
  published: boolean;
  hidden?: boolean;
  exercises: any[];
  card?: CollectionCard;
}
