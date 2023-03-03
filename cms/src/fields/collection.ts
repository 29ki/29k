import {CmsField, CmsFieldBase, CmsFieldRelation} from 'netlify-cms-core';
import {ID_FIELD, IMAGE_FIELD, NAME_FIELD} from './common';

export const EXERCISES_FIELD: CmsFieldBase & CmsFieldRelation = {
  label: '🚴 Exercises',
  name: 'exercises',
  widget: 'relation',
  collection: 'exercises',
  search_fields: ['exercise'],
  value_field: 'id',
  display_fields: ['name'],
  multiple: true,
  i18n: 'duplicate',
};

export const COLLECTION_FIELDS: Array<CmsField> = [
  ID_FIELD,
  NAME_FIELD,
  IMAGE_FIELD,
  EXERCISES_FIELD,
];
