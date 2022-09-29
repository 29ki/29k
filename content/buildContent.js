import fs from 'fs';
import {mergeDeepRight} from 'ramda';
import {
  filterPublishedContent,
  generateI18NResources,
  getContentByType,
} from './utils.js';

const locales = ['en', 'sv', 'pt'];

const exercises = generateI18NResources(
  filterPublishedContent(getContentByType('exercises')),
  'exercises',
);
const ui = generateI18NResources(getContentByType('ui'));
const exerciseIds = Object.keys(
  filterPublishedContent(getContentByType('exercises')),
);
const contentIds = locales.reduce(
  (acc, locale) => ({
    ...acc,
    [locale]: {contentIds: {all: exerciseIds, exercises: exerciseIds}},
  }),
  {},
);
const i18n = mergeDeepRight(mergeDeepRight(ui, exercises), contentIds);
const {contributors} = JSON.parse(fs.readFileSync('../.all-contributorsrc'));

const data = JSON.stringify({
  i18n,
  contributors,
});

if (process.argv.length > 2) {
  fs.writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}

console.log('Content built!');
