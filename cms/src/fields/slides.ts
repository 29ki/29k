import {CmsField, CmsFieldBase, CmsFieldObject} from 'netlify-cms-core';

import {IMAGE_FIELD, VIDEO_FIELD_WITH_AUDIO} from './common';

export const SLIDE_TYPES = {
  PARTICIPANT_SPOTLIGHT: 'participantSpotlight',
  CONTENT: 'content',
  REFLECTION: 'reflection',
  SHARING: 'sharing',
};

const CONTENT_VIDEO_FIELD = {
  ...VIDEO_FIELD_WITH_AUDIO,
  hint: 'Overrides image',
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

export const PARTICIPANT_SPOTLIGHT_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: 'Participant Spotlight',
  name: SLIDE_TYPES.PARTICIPANT_SPOTLIGHT,
  widget: 'object',
  collapsed: true,
  fields: [
    {
      label: 'Content',
      name: 'content',
      widget: 'hidden',
      required: false,
    },
  ],
};

export const CONTENT_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: 'Content',
  name: SLIDE_TYPES.CONTENT,
  widget: 'object',
  collapsed: true,
  fields: [
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
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      collapsed: false,
      fields: CONTENT_FIELDS,
    },
  ],
};
