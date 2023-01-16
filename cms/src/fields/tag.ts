import {CmsField} from 'netlify-cms-core';
import {ID_FIELD} from './common';

export const TAG_FIELDS: Array<CmsField> = [
  ID_FIELD,
  {
    name: 'tag',
    label: '🏷 Tag',
    widget: 'string',
    i18n: true,
  },
  {
    label: '🔢 Order',
    name: 'order',
    i18n: 'duplicate',
    widget: 'number',
    hint: 'Where tags are featured low number will show first.',
    required: false,
    value_type: 'int',
  },
];
