import {
  CmsField,
  CmsFieldBase,
  CmsFieldBoolean,
  CmsFieldCode,
  CmsFieldList,
} from 'decap-cms-core';
import {applyDefaults} from '../lib/fields';
import defaults from '../defaults/exercise.json';

import {COLORS} from '../../../shared/src/constants/colors';
import {
  ID_FIELD,
  NAME_FIELD,
  PUBLISHED_FIELD,
  VIDEO_FIELD,
  ASYNC_DURATION_FIELD,
  HIDDEN_FIELD,
  CARD_IMAGE_FIELD,
  DESCRIPTION_FIELD,
  ASYNC_FIELD,
  LIVE_FIELD,
  LINK_FIELD,
  CO_CREATORS_FIELD,
  BACKGROUND_COLOR_FIELD,
  LOTTIE_FIELD,
  IMAGE_BACKGROUND_COLOR_FIELD,
  AUDIO_FIELD,
  LOCKED_FIELD,
  EXCLUDE_WEB_FIELD,
  LIVE_DURATION_FIELD,
} from './common';
import {TAGS_FIELD} from './relations';
import {
  CONTENT_SLIDE,
  HOST_NOTES,
  HOST_SLIDE,
  REFLECTION_SLIDE,
  SHARING_SLIDE,
  INSTRUCTION_SLIDE,
} from './slides';
import {CLOUDINARY_IMAGE_CONFIG} from './constants';
import {JSONObject} from '../../../shared/src/types/JSON';

const CARD_FIELD: CmsField = {
  label: '🪪 Card',
  name: 'card',
  i18n: true,
  widget: 'object',
  collapsed: true,
  fields: [
    IMAGE_BACKGROUND_COLOR_FIELD,
    CARD_IMAGE_FIELD,
    {...LOTTIE_FIELD, hint: '❗️ Overrides image'},
  ],
};

const TEXT_COLOR: CmsField = {
  label: '㊗️ Text Color',
  name: 'textColor',
  widget: 'select',
  multiple: false,
  i18n: true,
  default: COLORS.ACTION,
  options: [
    {label: 'Light', value: COLORS.WHITE},
    {label: 'Dark', value: COLORS.BLACK},
  ],
  required: false,
};

export const SOCIAL_MEDIA: CmsField = {
  label: '🔗 Social Media Meta Tags',
  name: 'socialMeta',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: '🪧 Title',
      name: 'title',
      hint: `❗️ Defaults to ${NAME_FIELD.label}`,
      widget: 'string',
      i18n: true,
      required: false,
    },
    {
      label: '📃 Description',
      name: 'description',
      hint: `❗️ Defaults to ${DESCRIPTION_FIELD.label}`,
      widget: 'string',
      i18n: true,
      required: false,
    },
    {
      label: '🌅 Image',
      name: 'image',
      hint: `❗️ Defaults to ${CARD_FIELD.label} → ${CARD_IMAGE_FIELD.label}`,
      widget: 'image',
      required: false,
      i18n: true,
      allow_multiple: false,
      media_library: CLOUDINARY_IMAGE_CONFIG,
    },
  ],
};

const P5JS_SCRIPT: CmsFieldBase & CmsFieldCode = {
  label: '🎆 P5.js script',
  name: 'p5JsScript',
  widget: 'code',
  default_language: 'javascript',
  allow_language_selection: false,
  hint: '❗️ Overrides video',
};

const DESKTOP_OPTIMIZED: CmsFieldBase & CmsFieldBoolean = {
  name: 'desktopOptimized',
  label: '🖥️ Desktop Optimized',
  widget: 'boolean',
  required: false,
  default: false,
};

export const INTRO_PORTAL: CmsField = {
  label: '🌇 Intro Portal',
  name: 'introPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    DESKTOP_OPTIMIZED,
    {
      ...VIDEO_FIELD,
      fields: [...VIDEO_FIELD.fields, P5JS_SCRIPT, AUDIO_FIELD],
      label: '🎥 Video Loop',
      name: 'videoLoop',
    },
    {...VIDEO_FIELD, label: '🎥 Video End', name: 'videoEnd'},
    TEXT_COLOR,
    HOST_NOTES,
  ],
};

export const OUTRO_PORTAL: CmsField = {
  label: '🌃 Outro Portal',
  name: 'outroPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    DESKTOP_OPTIMIZED,
    {
      ...VIDEO_FIELD,
      fields: [...VIDEO_FIELD.fields, AUDIO_FIELD],
      hint: `❗️ ${INTRO_PORTAL.label} will be used if no video is provided`,
    },
  ],
};

const THEME: CmsField = {
  label: '🎨 Theme',
  name: 'theme',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [TEXT_COLOR, BACKGROUND_COLOR_FIELD],
};

export const SLIDES: CmsFieldBase & CmsFieldList = {
  label: '🖼️ Slides',
  label_singular: '🖼️ Slide',
  name: 'slides',
  widget: 'list',
  i18n: true,
  summary: '{{fields.content.heading}}',
  types: [
    CONTENT_SLIDE,
    INSTRUCTION_SLIDE,
    REFLECTION_SLIDE,
    SHARING_SLIDE,
    HOST_SLIDE,
  ],
};

const EXERCISE_FIELDS: Array<CmsField> = applyDefaults(
  [
    ID_FIELD,
    NAME_FIELD,
    DESCRIPTION_FIELD,
    ASYNC_DURATION_FIELD,
    LIVE_DURATION_FIELD,
    CO_CREATORS_FIELD,
    TAGS_FIELD,
    LINK_FIELD,
    PUBLISHED_FIELD,
    HIDDEN_FIELD,
    LOCKED_FIELD,
    LIVE_FIELD,
    ASYNC_FIELD,
    EXCLUDE_WEB_FIELD,
    SOCIAL_MEDIA,
    CARD_FIELD,
    THEME,
    INTRO_PORTAL,
    OUTRO_PORTAL,
    SLIDES,
  ],
  defaults as JSONObject,
);

export default EXERCISE_FIELDS;
