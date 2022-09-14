export const ID_FIELD = {
  label: 'ID',
  name: 'id',
  widget: 'uniqueId',
  i18n: 'duplicate',
};

export const NAME_FIELD = {
  label: 'Name',
  name: 'name',
  i18n: true,
  widget: 'string',
};

export const IMAGE_FIELD = {
  label: 'Image',
  name: 'image',
  widget: 'image',
  i18n: true,
};

export const VIDEO_FIELD = {
  label: 'Video',
  name: 'video',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: 'Video file',
      name: 'source',
      widget: 'file',
      required: false,
      i18n: true,
    },
  ],
};
