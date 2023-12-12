import {CmsField} from 'decap-cms-core';
import {ID_FIELD, PUBLISHED_FIELD, SORT_ORDER_FIELD} from './common';

export const TAG_FIELDS: Array<CmsField> = [
  ID_FIELD,
  {
    name: 'name',
    label: '🏷 Name',
    widget: 'string',
    i18n: true,
  },
  SORT_ORDER_FIELD,
  PUBLISHED_FIELD,
];
