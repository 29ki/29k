/* eslint-disable */
/* tslint:disable */

export interface CollectionCoCreator {
  name: string;
  url: string;
  image: string;
}

export interface CollectionImage {
  description?: string;
  source?: string;
}

export interface CollectionCardColor {
  color: string;
}

export interface CollectionCard {
  description?: string;
  backgroundColorGradient?: CollectionCardColor[];
  textColor?: string;
}

export interface Collection {
  id: any;
  name: string;
  description?: string;
  coCreators?: CollectionCoCreator[];
  link?: string;
  image?: CollectionImage;
  tags?: any[];
  sortOrder?: number;
  published: boolean;
  hidden?: boolean;
  exercises?: any[];
  card?: CollectionCard;
}
