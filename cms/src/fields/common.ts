import {CmsField} from 'netlify-cms-core';

export const ID_FIELD: CmsField = {
  label: 'ID',
  name: 'id',
  widget: 'uniqueId',
  i18n: 'duplicate',
  required: false,
  index_file: '',
  meta: false,
};

export const PUBLISHED_FIELD: CmsField = {
  label: 'Published',
  name: 'published',
  widget: 'boolean',
  required: true,
  default: false,
  i18n: true,
};

export const NAME_FIELD: CmsField = {
  label: 'Name',
  name: 'name',
  i18n: true,
  widget: 'string',
};

export const IMAGE_FIELD: CmsField = {
  label: 'Image',
  name: 'image',
  widget: 'object',
  required: false,
  i18n: true,
  fields: [
    {
      label: 'Description',
      name: 'description',
      widget: 'string',
      required: false,
      i18n: true,
    },
    {
      label: 'Image file',
      name: 'source',
      widget: 'image',
      required: false,
      i18n: true,
    },
  ],
};

export const VIDEO_FIELD: CmsField = {
  label: 'Video',
  name: 'video',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: 'Description',
      name: 'description',
      widget: 'string',
      required: false,
      i18n: true,
    },
    {
      label: 'Video file',
      name: 'source',
      widget: 'file',
      required: false,
      media_library: {
        config: {
          muiltiple: true,
        },
      },
      i18n: true,
    },
    {
      label: 'Preview image',
      name: 'preview',
      widget: 'image',
      required: false,
      i18n: false,
    },
  ],
};

const AUDIO_FIELD: CmsField = {
  label: 'Audio file',
  name: 'audio',
  widget: 'file',
  required: false,
  i18n: false,
};

export const VIDEO_FIELD_WITH_AUDIO: CmsField = {
  ...VIDEO_FIELD,
  fields: [...VIDEO_FIELD.fields, AUDIO_FIELD],
};

export const CARD_FIELD: CmsField = {
  label: 'Card',
  name: 'card',
  i18n: true,
  widget: 'object',
  collapsed: true,
  fields: [IMAGE_FIELD],
};
