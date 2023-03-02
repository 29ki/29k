/* eslint-disable */
/* tslint:disable */

export interface CollectionImage {
  description?: string;
  source?: string;
}

export interface Collection {
  id: any;
  name: string;
  image?: CollectionImage;
  exercises: any[];
}
