/* eslint-disable */
/* tslint:disable */

export interface CategoryLottie {
  description?: string;
  source?: string;
  subtitles?: string;
}

export interface Category {
  id: any;
  name: string;
  lottie?: CategoryLottie;
  published: boolean;
  collections: any[];
  exercises: any[];
}
