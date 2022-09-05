import fs from 'fs';
import {generateI18NResources, getContentByType, mergeDeep} from './utils.js';

const exercises = generateI18NResources(
  getContentByType('exercises'),
  'exercises',
);
const ui = generateI18NResources(getContentByType('ui'));
const data = JSON.stringify(mergeDeep(ui, exercises));

if (process.argv.length > 2) {
  fs.writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}

console.log('Content built!');
