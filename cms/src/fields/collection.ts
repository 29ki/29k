import {CmsField} from 'netlify-cms-core';
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
  TEXT_COLOR_FIELD,
} from './common';
import {TAGS_FIELD} from './relations';
import {EXERCISES_FIELD} from './relations';

export const COLLECTION_FIELDS: Array<CmsField> = [
  ID_FIELD,
  NAME_FIELD,
  DESCRIPTION_FIELD,
  CO_CREATORS_FIELD,
  LINK_FIELD,
  CARD_IMAGE_FIELD,
  TAGS_FIELD,
  SORT_ORDER_FIELD,
  PUBLISHED_FIELD,
  HIDDEN_FIELD,
  EXERCISES_FIELD,
  {
    label: '🪪 Card',
    name: 'card',
    i18n: true,
    widget: 'object',
    collapsed: true,
    required: false,
    fields: [
      {
        label: '🪪 Card description',
        name: 'description',
        widget: 'string',
        i18n: true,
        required: false,
        hint: 'Description displayed on the card',
      },
      {
        label: '🎨 Background colors',
        label_singular: 'Color',
        name: 'backgroundColorGradient',
        widget: 'list',
        i18n: true,
        required: false,
        summary: '{{fields.color}}',
        fields: [
          {
            name: 'color',
            label: 'Color',
            widget: 'color',
            allowInput: true,
          },
        ],
      },
      TEXT_COLOR_FIELD,
    ],
  },
];
