import {CmsField} from 'netlify-cms-core';

const EDITOR_TEXT_TEMPLATES_FIELDS: Array<CmsField> = [
  {
    label: '🔖 Text templates',
    label_singular: '🔖 Text template',
    name: 'templates',
    widget: 'list',
    summary: '{{fields.name}} - {{fields.text}}',
    min: 1,
    fields: [
      {
        label: '🔖 Name',
        name: 'name',
        widget: 'string',
        required: true,
      },
      {
        label: '📝 Text',
        name: 'text',
        widget: 'text',
        required: true,
      },
    ],
  },
];

export default EDITOR_TEXT_TEMPLATES_FIELDS;
