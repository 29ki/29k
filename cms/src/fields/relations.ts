import {CmsFieldBase, CmsFieldRelation} from 'decap-cms-core';

export const TAGS_FIELD: CmsFieldBase & CmsFieldRelation = {
  label: '🏷 Tags',
  name: 'tags',
  widget: 'relation',
  collection: 'tags',
  search_fields: ['name'],
  value_field: 'id',
  display_fields: ['name'],
  multiple: true,
  options_length: Infinity,
  i18n: 'duplicate',
  required: false,
};

export const COLLECTIONS_FIELD: CmsFieldBase & CmsFieldRelation = {
  label: '📦 Collections',
  name: 'collections',
  widget: 'relation',
  collection: 'collections',
  search_fields: ['name'],
  value_field: 'id',
  display_fields: ['name'],
  options_length: Infinity,
  multiple: true,
  i18n: 'duplicate',
  required: true,
};

export const EXERCISES_FIELD: CmsFieldBase & CmsFieldRelation = {
  label: '📝 Exercises',
  name: 'exercises',
  widget: 'relation',
  collection: 'exercises',
  search_fields: ['name'],
  value_field: 'id',
  display_fields: ['name'],
  options_length: Infinity,
  multiple: true,
  i18n: 'duplicate',
  required: true,
};
