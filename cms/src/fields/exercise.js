import {COLORS} from '../../../shared/src/constants/colors';
import {
  CARD_FIELD,
  ID_FIELD,
  VIDEO_FIELD,
  NAME_FIELD,
  PUBLISHED_FIELD,
} from './common';
import {
  CONTENT_SLIDE,
  PARTICIPANT_SPOTLIGHT_SLIDE,
  REFLECTION_SLIDE,
  SHARING_SLIDE,
} from './slides';

const INTRO_PORTAL = {
  label: 'Intro Portal',
  name: 'introPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {...VIDEO_FIELD, label: 'Video Loop', name: 'videoLoop'},
    {...VIDEO_FIELD, label: 'Video End', name: 'videoEnd'},
  ],
};

const OUTRO_PORTAL = {
  label: 'Outro Portal',
  name: 'outroPortal',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [{...VIDEO_FIELD, label: 'Video', name: 'video'}],
};

const THEME = {
  label: 'Theme',
  name: 'theme',
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  fields: [
    {
      label: 'Text Color',
      name: 'textColor',
      widget: 'select',
      multiple: false,
      i18n: 'duplicate',
      default: COLORS.ACTION,
      options: [
        {label: 'Light', value: COLORS.WHITE},
        {label: 'Dark', value: COLORS.BLACK},
      ],
      required: false,
    },
    {
      label: 'Background Color',
      name: 'backgroundColor',
      widget: 'color',
      i18n: 'duplicate',
      required: false,
    },
  ],
};

const NOTE_TYPES = {
  PORTAL_NOTE: 'portalNote',
  SPOTLIGHT_NOTE: 'spotlightNote',
  CONTENT_NOTE: 'ContentNote',
  REFLECTION_NOTE: 'ReflectionNote',
  SHARING_NOTE: 'SharingNote',
};

const NOTES_FIELDS = {
  label: 'Notes',
  name: 'notes',
  widget: 'list',
  collapsed: false,
  fields: [
    {
      label: 'Text',
      name: 'text',
      widget: 'string',
      required: true,
    },
  ],
};
export const PORTAL_NOTE = {
  label: 'Portal Note',
  name: NOTE_TYPES.PORTAL_NOTE,
  widget: 'object',
  collapsed: true,
  fields: [NOTES_FIELDS],
};
export const SPOTLIGHT_NOTE = {
  label: 'Spotlight Note',
  name: NOTE_TYPES.SPOTLIGHT_NOTE,
  widget: 'object',
  collapsed: true,
  fields: [NOTES_FIELDS],
};
export const CONTENT_NOTE = {
  label: 'Content Note',
  name: NOTE_TYPES.CONTENT_NOTE,
  widget: 'object',
  collapsed: true,
  fields: [NOTES_FIELDS],
};
export const REFLECTION_NOTE = {
  label: 'Reflection Note',
  name: NOTE_TYPES.REFLECTION_NOTE,
  widget: 'object',
  collapsed: true,
  fields: [NOTES_FIELDS],
};
export const SHARING_NOTE = {
  label: 'Sharing Note',
  name: NOTE_TYPES.SHARING_NOTE,
  widget: 'object',
  collapsed: true,
  fields: [NOTES_FIELDS],
};

export default [
  ID_FIELD,
  NAME_FIELD,
  PUBLISHED_FIELD,
  CARD_FIELD,
  THEME,
  INTRO_PORTAL,
  OUTRO_PORTAL,
  {
    label: 'Slides',
    name: 'slides',
    widget: 'list',
    i18n: true,
    types: [
      CONTENT_SLIDE,
      REFLECTION_SLIDE,
      SHARING_SLIDE,
      PARTICIPANT_SPOTLIGHT_SLIDE,
    ],
  },

  {
    label: 'Host Notes',
    name: 'hostnotes',
    widget: 'list',
    i18n: true,
    types: [
      PORTAL_NOTE,
      SPOTLIGHT_NOTE,
      CONTENT_NOTE,
      REFLECTION_NOTE,
      SHARING_NOTE,
    ],
  },
];
