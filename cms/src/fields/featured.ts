import {CmsField} from 'netlify-cms-core';
import {COLLECTIONS_FIELD, EXERCISES_FIELD} from './relations';

export const FEATURED_FIELDS: Array<CmsField> = [
  EXERCISES_FIELD,
  COLLECTIONS_FIELD,
];
