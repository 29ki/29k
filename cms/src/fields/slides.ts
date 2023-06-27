import {
  CmsField,
  CmsFieldBase,
  CmsFieldObject,
  CmsFieldList,
} from 'netlify-cms-core';

import {
  IMAGE_FIELD,
  LOTTIE_FIELD_WITH_AUDIO,
  MANUAL_ID_FIELD,
  VIDEO_FIELD,
  VIDEO_FIELD_WITH_AUDIO,
} from './common';

export const SLIDE_TYPES = {
  HOST: 'host',
  CONTENT: 'content',
  REFLECTION: 'reflection',
  SHARING: 'sharing',
  INSTRUCTION: 'instruction',
};

export const HOST_NOTES: CmsFieldBase & CmsFieldList = {
  label: '📝 Host Notes',
  name: 'hostNotes',
  widget: 'list',
  hint: 'Set each text block to a maximum of 50 words',
  label_singular: '📝 Host note',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '📝 Text',
      name: 'text',
      widget: 'markdown',
      required: false,
      i18n: true,
      minimal: true,
    },
  ],
};

const CONTENT_VIDEO_FIELD: CmsFieldBase & CmsFieldObject = {
  ...VIDEO_FIELD_WITH_AUDIO,
  hint: 'Overrides image',
  fields: [
    {
      label: '🔁 Auto Play & Loop',
      name: 'autoPlayLoop',
      hint: 'This automatically plays and loops the video. Play controls will be disabled.',
      required: false,
      widget: 'boolean',
    },
    {
      label: '⏱️ Duration timer',
      name: 'durationTimer',
      hint: 'This shows a duration timer in the top right corner. Useful for stand-alone audio.',
      required: false,
      widget: 'boolean',
    },
    ...VIDEO_FIELD_WITH_AUDIO.fields,
  ],
};

const CONTENT_LOTTIE_FIELD: CmsFieldBase & CmsFieldObject = {
  ...LOTTIE_FIELD_WITH_AUDIO,
  hint: 'Overrides video',
  fields: [
    {
      label: '🔁 Auto Play & Loop',
      name: 'autoPlayLoop',
      hint: 'This automatically plays and loops the video. Play controls will be disabled.',
      required: false,
      widget: 'boolean',
    },
    {
      label: '⏱️ Duration timer',
      name: 'durationTimer',
      hint: 'This shows a duration timer in the top right corner. Useful for stand-alone audio.',
      required: false,
      widget: 'boolean',
    },
    ...LOTTIE_FIELD_WITH_AUDIO.fields,
  ],
};

const CONTENT_FIELDS: Array<CmsField> = [
  {
    label: '◾️ Heading',
    name: 'heading',
    widget: 'string',
    required: false,
  },
  {
    label: '◾️ Text',
    name: 'text',
    widget: 'string',
    required: false,
  },
  IMAGE_FIELD,
  CONTENT_VIDEO_FIELD,
  CONTENT_LOTTIE_FIELD,
];

const INSTRUCTION_FIELDS: Array<CmsField> = [
  IMAGE_FIELD,
  {
    label: '◾️ Heading',
    name: 'heading',
    widget: 'string',
    required: false,
  },
  {
    label: '◾️ Text',
    name: 'text',
    widget: 'markdown',
    required: false,
  },
];

export const HOST_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: '💁‍♀️ Host slide',
  name: SLIDE_TYPES.HOST,
  widget: 'object',
  collapsed: true,
  fields: [HOST_NOTES, VIDEO_FIELD],
};

export const CONTENT_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: '📰 Content slide',
  name: SLIDE_TYPES.CONTENT,
  widget: 'object',
  collapsed: true,
  fields: [
    HOST_NOTES,
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      required: false,
      collapsed: false,
      fields: CONTENT_FIELDS,
    },
  ],
};

export const INSTRUCTION_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: '📃 Instruction slide (Async)',
  name: SLIDE_TYPES.INSTRUCTION,
  widget: 'object',
  collapsed: true,
  fields: [
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      required: false,
      collapsed: false,
      fields: INSTRUCTION_FIELDS,
    },
  ],
};

export const REFLECTION_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: '🤔 Reflection slide',
  name: SLIDE_TYPES.REFLECTION,
  widget: 'object',
  collapsed: true,
  fields: [
    HOST_NOTES,
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      required: false,
      collapsed: false,
      fields: CONTENT_FIELDS,
    },
  ],
};

export const SHARING_SLIDE: CmsFieldBase & CmsFieldObject = {
  label: '🎤 Sharing slide',
  name: SLIDE_TYPES.SHARING,
  widget: 'object',
  collapsed: true,
  summary: '{{content.heading}} - ({{id}})',
  fields: [
    {
      ...MANUAL_ID_FIELD,
      hint: 'If there are several sharing slides, add a uniqe id to separate them. Duplicate them over languages if refering to the same sharing',
    },
    HOST_NOTES,
    {
      label: 'Content',
      name: 'content',
      widget: 'object',
      required: false,
      collapsed: false,
      fields: CONTENT_FIELDS,
    },
  ],
};
