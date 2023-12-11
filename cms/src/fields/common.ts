import {CmsField, CmsFieldBase, CmsFieldObject} from 'netlify-cms-core';
import {
  CLOUDINARY_AUDIO_CONFIG,
  CLOUDINARY_CARD_IMAGE_CONFIG,
  CLOUDINARY_COCREATOR_IMAGE_CONFIG,
  CLOUDINARY_FILE_CONFIG,
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

export const LIVE_FIELD: CmsField = {
  label: '🏙 Live',
  name: 'live',
  widget: 'boolean',
  required: false,
  default: true,
  i18n: true,
  hint: 'This will make the exercise available as live',
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

export const LINK_FIELD: CmsField = {
  label: '🔗 Link',
  name: 'link',
  i18n: 'duplicate',
  widget: 'string',
  required: false,
  hint: 'Ask dev to get a firebase dynamic link generated',
};

export const DESCRIPTION_FIELD: CmsField = {
  label: '📃 Description',
  name: 'description',
  widget: 'markdown',
  required: false,
  minimal: true,
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

export const TEXT_COLOR_FIELD: CmsField = {
  label: '🎨 Text color',
  name: 'textColor',
  widget: 'color',
  i18n: true,
  allowInput: true,
  required: false,
};

export const BACKGROUND_COLOR_FIELD: CmsField = {
  label: '🎨 Background Color',
  name: 'backgroundColor',
  widget: 'color',
  i18n: true,
  required: false,
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

export const CARD_IMAGE_FIELD: CmsFieldBase & CmsFieldObject = {
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
      media_library: CLOUDINARY_CARD_IMAGE_CONFIG,
    },
  ],
};

export const PROFILE_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '🦹‍♂️ Profile',
  name: 'profile',
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

const SUBTITLES_FIELD: CmsField = {
  label: '🗒 Subtitles file',
  name: 'subtitles',
  widget: 'file',
  required: false,
  i18n: true,
  allow_multiple: false,
  media_library: CLOUDINARY_IMAGE_CONFIG,
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
      media_library: CLOUDINARY_FILE_CONFIG,
    },
    SUBTITLES_FIELD,
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
    SUBTITLES_FIELD,
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
      hint: '❗️ This will override the audio of the video. Video will automatically loop to the length of the audio.',
    },
  ],
};

export const LOTTIE_FIELD_WITH_AUDIO: CmsFieldBase & CmsFieldObject = {
  ...LOTTE_FIELD,
  fields: [
    ...LOTTE_FIELD.fields,
    {
      ...AUDIO_FIELD,
      hint: '❗️ Lottie will automatically loop to the length of the audio.',
    },
  ],
};

export const SORT_ORDER_FIELD: CmsField = {
  label: '#️⃣ Sort Order',
  name: 'sortOrder',
  widget: 'number',
  i18n: 'duplicate',
  required: false,
  value_type: 'int',
  hint: 'Low number will show first.',
};

export const CO_CREATORS_FIELD: CmsField = {
  label: '🪡 Co-creators',
  label_singular: '🪡 Co-creator',
  name: 'coCreators',
  collapsed: true,
  required: false,
  i18n: true,
  widget: 'list',
  fields: [
    {
      label: '👤 Name',
      name: 'name',
      widget: 'string',
    },
    {
      label: '🔗 Link',
      name: 'url',
      widget: 'string',
    },
    {
      label: '🖼️ Image',
      name: 'image',
      widget: 'image',
      allow_multiple: false,
      media_library: CLOUDINARY_COCREATOR_IMAGE_CONFIG,
    },
  ],
};
