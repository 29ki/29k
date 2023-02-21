import {
  CmsField,
  CmsFieldBase,
  CmsFieldObject,
  CmsFieldRelation,
} from 'netlify-cms-core';
import {
  CLOUDINARY_AUDIO_CONFIG,
  CLOUDINARY_IMAGE_CONFIG,
  CLOUDINARY_VIDEO_CONFIG,
} from './constants';

export const ID_FIELD: CmsField = {
  label: '🆔',
  name: 'id',
  widget: 'uniqueId',
  i18n: 'duplicate',
  required: true,
  index_file: '',
  meta: false,
};

export const MANUAL_ID_FIELD: CmsField = {
  label: '✍️ 🆔',
  name: 'id',
  widget: 'string',
  i18n: false,
  required: true,
  default: 'sharing',
};

export const PUBLISHED_FIELD: CmsField = {
  label: '📢 Published',
  name: 'published',
  widget: 'boolean',
  required: true,
  default: false,
  i18n: true,
  hint: "This will make it included in the app. For work in progress, use in combination with hidden and the 'Show work in progress' switch in the app to access it only in staging.",
};

export const ASYNC_FIELD: CmsField = {
  label: '🏝 Async',
  name: 'async',
  widget: 'boolean',
  required: false,
  default: false,
  i18n: true,
  hint: 'This will make the exercise available as async',
};

export const HIDDEN_FIELD: CmsField = {
  label: '🙈 Hidden',
  name: 'hidden',
  widget: 'boolean',
  required: false,
  default: false,
  i18n: true,
  hint: "This will make it hidden by default. For work in progress, use in combination with published and the 'Show work in progress' switch in the app to access it only in staging.",
};

export const NAME_FIELD: CmsField = {
  label: '📇 Name',
  name: 'name',
  i18n: true,
  widget: 'string',
};

export const DESCRIPTION_FIELD: CmsField = {
  label: '📃 Description',
  name: 'description',
  widget: 'markdown',
  required: false,
  i18n: true,
};

export const DURATION_FIELD: CmsField = {
  label: '⏱ Duration',
  name: 'duration',
  hint: 'In minutes',
  i18n: 'duplicate',
  required: true,
  widget: 'number',
  value_type: 'int',
};

export const IMAGE_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '🌅 Image',
  name: 'image',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '📃 Description',
      name: 'description',
      widget: 'string',
      required: false,
      i18n: true,
    },
    {
      label: '🌅 Image file',
      name: 'source',
      widget: 'image',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_IMAGE_CONFIG,
    },
  ],
};

export const HOST_PROFILE_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '🦹‍♂️ Host',
  name: 'host',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '📃 Name',
      name: 'displayName',
      widget: 'string',
      required: false,
      i18n: true,
    },
    {
      label: '🌅 Profile image',
      name: 'photoURL',
      widget: 'image',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_IMAGE_CONFIG,
    },
  ],
};

export const LOTTE_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '💃 Lottie',
  name: 'lottie',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '📃 Description',
      name: 'description',
      widget: 'string',
      required: false,
      i18n: true,
    },
    {
      label: '💃 Lottie file',
      name: 'source',
      widget: 'file',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_IMAGE_CONFIG,
    },
  ],
};

export const VIDEO_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '🎥 Video',
  name: 'video',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '📃 Description',
      name: 'description',
      widget: 'string',
      required: false,
      i18n: true,
    },
    {
      label: '🎥 Video file',
      name: 'source',
      widget: 'file',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_VIDEO_CONFIG,
    },
    {
      label: '🌅 Preview image',
      name: 'preview',
      widget: 'image',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_IMAGE_CONFIG,
    },
  ],
};

const AUDIO_FIELD: CmsField = {
  label: '🔈 Audio file',
  name: 'audio',
  widget: 'file',
  required: false,
  i18n: true,
  allow_multiple: false,
  media_library: CLOUDINARY_AUDIO_CONFIG,
};

export const VIDEO_FIELD_WITH_AUDIO: CmsFieldBase & CmsFieldObject = {
  ...VIDEO_FIELD,
  fields: [
    ...VIDEO_FIELD.fields,
    {
      ...AUDIO_FIELD,
      hint: 'This will override the audio of the video. Video will automatically loop while playing.',
    },
  ],
};

export const LOTTIE_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '💃 Lottie',
  name: 'lottie',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '📃 Description',
      name: 'description',
      widget: 'string',
      required: false,
      i18n: true,
    },
    {
      label: '💃 Lottie file',
      name: 'source',
      widget: 'file',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_IMAGE_CONFIG,
    },
  ],
};

export const LOTTIE_FIELD_WITH_DURATION = {
  ...LOTTIE_FIELD,
  fields: [
    ...LOTTIE_FIELD.fields,
    {...DURATION_FIELD, hint: 'Duration in seconds', required: false},
  ],
};

export const LOTTIE_FIELD_WITH_AUDIO: CmsFieldBase & CmsFieldObject = {
  ...LOTTIE_FIELD_WITH_DURATION,
  fields: [
    ...LOTTIE_FIELD.fields,
    {
      ...AUDIO_FIELD,
      hint: 'Animation will automatically loop while playing.',
    },
    {...DURATION_FIELD, hint: 'Duration in seconds', required: false},
  ],
};

export const CARD_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '🪪 Card',
  name: 'card',
  i18n: true,
  widget: 'object',
  collapsed: true,
  fields: [
    IMAGE_FIELD,
    {...LOTTE_FIELD, hint: 'Overrides image'},
    {...HOST_PROFILE_FIELD, hint: 'Only used for the Async version'},
  ],
};

export const TAGS_FIELD: CmsFieldBase & CmsFieldRelation = {
  label: '🏷 Tags',
  name: 'tags',
  widget: 'relation',
  collection: 'tags',
  search_fields: ['tag'],
  value_field: 'id',
  display_fields: ['tag'],
  multiple: true,
  i18n: 'duplicate',
  required: false,
};
