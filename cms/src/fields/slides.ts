import {
  CmsField,
  CmsFieldBase,
  CmsFieldObject,
  CmsFieldList,
} from 'netlify-cms-core';

import {IMAGE_FIELD, VIDEO_FIELD_WITH_AUDIO} from './common';

export const SLIDE_TYPES = {
  HOST: 'host',
  CONTENT: 'content',
  REFLECTION: 'reflection',
  SHARING: 'sharing',
};

export const HOST_NOTES: CmsFieldBase & CmsFieldList = {
  label: 'Host Notes',
  name: 'hostNotes',
  widget: 'list',
  hint: 'Set each text block to a maximum of 50 words',
  label_singular: 'Host note',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: 'Text',
      name: 'text',
      widget: 'markdown',
      required: true,
      i18n: true,
    },
  ],
};

const CONTENT_VIDEO_FIELD: CmsFieldBase & CmsFieldObject = {
  ...VIDEO_FIELD_WITH_AUDIO,
  hint: 'Overrides image',
  fields: [
    {
      label: 'Auto Play & Loop',
      name: 'autoPlayLoop',
      hint: 'This automatically plays and loops the video. Play controls will be disabled.',
      required: false,
      widget: 'boolean',
    },
    ...VIDEO_FIELD_WITH_AUDIO.fields,
  ],
};

const CONTENT_FIELDS: Array<CmsField> = [
  {
    label: 'Heading',
    name: 'heading',
    widget: 'string',
    required: false,
  },
  {
    label: 'Text',
    name: 'text',
    widget: 'string',
    required: false,
  },
  IMAGE_FIELD,
  CONTENT_VIDEO_FIELD,
];

export const HOST_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: 'Host',
  name: SLIDE_TYPES.HOST,
  widget: 'object',
  collapsed: true,
  fields: [HOST_NOTES],
};

export const CONTENT_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: 'Content',
  name: SLIDE_TYPES.CONTENT,
  widget: 'object',
  collapsed: true,
  fields: [
    HOST_NOTES,
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      collapsed: false,
      fields: CONTENT_FIELDS,
    },
  ],
};

export const REFLECTION_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: 'Reflection',
  name: SLIDE_TYPES.REFLECTION,
  widget: 'object',
  collapsed: true,
  fields: [
    HOST_NOTES,
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      collapsed: false,
      fields: CONTENT_FIELDS,
    },
  ],
};

export const SHARING_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: 'Sharing',
  name: SLIDE_TYPES.SHARING,
  widget: 'object',
  collapsed: true,
  fields: [
    HOST_NOTES,
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      collapsed: false,
      fields: CONTENT_FIELDS,
    },
  ],
};
