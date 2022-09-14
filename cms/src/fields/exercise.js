import {ID_FIELD, NAME_FIELD, PUBLISHED_FIELD} from './common';
import {
  CONTENT_SLIDE,
  PARTICIPANT_SPOTLIGHT_SLIDE,
  REFLECTION_SLIDE,
  SHARING_SLIDE,
} from './slides';

export default [
  ID_FIELD,
  NAME_FIELD,
  PUBLISHED_FIELD,
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
];
