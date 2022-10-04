import fs from 'fs';
import {mergeDeepRight} from 'ramda';
import {
  filterPublishedContent,
  generateI18NResources,
  getContentByType,
} from './utils.js';

const exercises = generateI18NResources(
  filterPublishedContent(getContentByType('exercises')),
  'exercises',
);
const ui = generateI18NResources(getContentByType('ui'));
const i18n = mergeDeepRight(ui, exercises);

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
