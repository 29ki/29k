import fs from 'fs';
import {mergeDeepRight} from 'ramda';
import {DEFAULT_LANGUAGE_TAG} from '../shared/src/constants/i18n.js';
import {
  filterPublishedContent,
  generateI18NResources,
  getContentByType,
} from './utils.js';

const exerciseContent = getContentByType('exercises');
const exercises = generateI18NResources(
  filterPublishedContent(exerciseContent),
  'exercises',
);
const exerciseIds = Object.keys(
  filterPublishedContent(exerciseContent, DEFAULT_LANGUAGE_TAG),
);

const ui = generateI18NResources(getContentByType('ui'));

const i18n = mergeDeepRight(ui, exercises);

const {contributors} = JSON.parse(fs.readFileSync('../.all-contributorsrc'));

const data = JSON.stringify({
  i18n,
  exerciseIds,
  contributors,
});

if (process.argv.length > 2) {
  fs.writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}

console.log('Content built!');
