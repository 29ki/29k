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
const data = JSON.stringify(mergeDeepRight(ui, exercises));

if (process.argv.length > 2) {
  fs.writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}

console.log('Content built!');
