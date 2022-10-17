import {CmsCollection} from 'netlify-cms-core';
import EXERCISE_FIELDS from '../fields/exercise';
import CONTRIBUTORS_FIELDS from '../fields/contributors';
import * as content from '../../../content/content.json';
import {generateFilesCollectionFromi18nFiles} from '../lib/i18n';

export const exercises: CmsCollection = {
  name: 'exercises',
  label: 'Exercises',
  label_singular: 'exercise',
  folder: '/content/src/exercises',
  identifier_field: 'id',
  extension: 'json',
  format: 'json',
  create: true,
  delete: true,
  publish: true,
  summary: '{{fields.name}}',
  slug: '{{id}}',
  editor: {
    preview: false,
  },
  fields: EXERCISE_FIELDS,
  i18n: true,
};

export const contributors: CmsCollection = {
  name: 'other',
  label: 'Other',
  files: [
    {
      label: 'All Contributors',
      name: 'all-contributorsrc',
      file: '/.all-contributorsrc',
      fields: CONTRIBUTORS_FIELDS,
    },
  ],
  i18n: false,
  extension: 'json',
  format: 'json',
  create: false,
  delete: false,
  publish: true,
  identifier_field: 'label',
  editor: {
    preview: false,
  },
};

export const files: CmsCollection = generateFilesCollectionFromi18nFiles(
  'ui',
  'UI',
  content.i18n,
  [exercises.name],
);
