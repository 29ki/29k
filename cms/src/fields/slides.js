import {IMAGE_FIELD, VIDEO_FIELD} from './common';

export const SLIDE_TYPES = {
  PARTICIPANT_SPOTLIGHT: 'participantSpotlight',
  CONTENT: 'content',
  REFLECTION: 'reflection',
  SHARING: 'sharing',
};

const CONTENT_IMAGE_FIELD = {
  label: 'Image',
  name: 'image',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: false,
  fields: [{...IMAGE_FIELD, name: 'source', required: false}],
};

const CONTENT_FIELDS = [
  {
    label: 'Heading',
    name: 'heading',
    widget: 'string',
  },
  CONTENT_IMAGE_FIELD,
  VIDEO_FIELD,
];

export const PARTICIPANT_SPOTLIGHT_SLIDE = {
  label: 'Participant Spotlight',
  name: SLIDE_TYPES.PARTICIPANT_SPOTLIGHT,
  widget: 'object',
  collapsed: true,
  fields: [
    {
      label: 'Content',
      name: 'content',
      widget: 'string',
      required: false,
    },
  ],
};

export const CONTENT_SLIDE = {
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

export const REFLECTION_SLIDE = {
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

export const SHARING_SLIDE = {
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
