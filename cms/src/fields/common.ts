import {CmsField, CmsFieldBase, CmsFieldObject} from 'netlify-cms-core';
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

export const PUBLISHED_FIELD: CmsField = {
  label: '📢 Published',
  name: 'published',
  widget: 'boolean',
  required: true,
  default: false,
  i18n: true,
};

export const NAME_FIELD: CmsField = {
  label: '📇 Name',
  name: 'name',
  i18n: true,
  widget: 'string',
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

export const CARD_FIELD: CmsFieldBase & CmsFieldObject = {
  label: '🪪 Card',
  name: 'card',
  i18n: true,
  widget: 'object',
  collapsed: true,
  fields: [IMAGE_FIELD],
};
