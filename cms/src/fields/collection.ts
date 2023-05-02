import {CmsField, CmsFieldBase, CmsFieldRelation} from 'netlify-cms-core';
import {
  DESCRIPTION_FIELD,
  HIDDEN_FIELD,
  ID_FIELD,
  IMAGE_FIELD,
  NAME_FIELD,
  PUBLISHED_FIELD,
  TAGS_FIELD,
} from './common';

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
  DESCRIPTION_FIELD,
  IMAGE_FIELD,
  TAGS_FIELD,
  PUBLISHED_FIELD,
  HIDDEN_FIELD,
  EXERCISES_FIELD,
];
