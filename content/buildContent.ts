import {readFileSync, writeFileSync} from 'fs';
import {mergeDeepRight} from 'ramda';
import {generateI18NResources, getContentByType} from './src/utils/utils';

const exercises = generateI18NResources(
  getContentByType('exercises'),
  'exercises',
);

const ui = generateI18NResources(getContentByType('ui'));
const tags = generateI18NResources(getContentByType('tags'), 'tags');
const collections = generateI18NResources(
  getContentByType('collections'),
  'collections',
);
const email = generateI18NResources(getContentByType('email'), 'email');

const i18n = mergeDeepRight(
  mergeDeepRight(
    mergeDeepRight(mergeDeepRight(mergeDeepRight(ui, exercises), tags)),
    collections,
  ),
  email,
);

const {contributors} = JSON.parse(
  readFileSync('../.all-contributorsrc', {encoding: 'utf8'}),
);

const data = JSON.stringify({
  i18n,
  contributors,
});

if (process.argv.length > 2) {
  writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}

console.log('Content built!');
