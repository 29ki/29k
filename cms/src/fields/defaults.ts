import {CmsField} from 'netlify-cms-core';
import {INTRO_PORTAL, OUTRO_PORTAL, SLIDES} from './exercise';

const EXERCISE_DEFAULTS_FIELDS: Array<CmsField> = [
  INTRO_PORTAL,
  OUTRO_PORTAL,
  SLIDES,
];

export default EXERCISE_DEFAULTS_FIELDS;
