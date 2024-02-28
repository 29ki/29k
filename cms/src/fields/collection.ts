import {CmsField} from 'decap-cms-core';
import {
  CO_CREATORS_FIELD,
  DESCRIPTION_FIELD,
  HIDDEN_FIELD,
  ID_FIELD,
  CARD_IMAGE_FIELD,
  LINK_FIELD,
  NAME_FIELD,
  PUBLISHED_FIELD,
  SORT_ORDER_FIELD,
  IMAGE_BACKGROUND_COLOR_FIELD,
  LOCKED_FIELD,
} from './common';
import {TAGS_FIELD} from './relations';
import {EXERCISES_FIELD} from './relations';

export const COLLECTION_FIELDS: Array<CmsField> = [
  ID_FIELD,
  NAME_FIELD,
  DESCRIPTION_FIELD,
  CO_CREATORS_FIELD,
  LINK_FIELD,
  {
    label: '🪪 Card',
    name: 'card',
    i18n: true,
    widget: 'object',
    collapsed: true,
    required: false,
    fields: [CARD_IMAGE_FIELD, IMAGE_BACKGROUND_COLOR_FIELD],
  },
  TAGS_FIELD,
  SORT_ORDER_FIELD,
  PUBLISHED_FIELD,
  HIDDEN_FIELD,
  LOCKED_FIELD,
  EXERCISES_FIELD,
];
