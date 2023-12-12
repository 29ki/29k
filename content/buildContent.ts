import {readFileSync, writeFileSync} from 'fs';
import {
  generateI18NResources,
  getContentByType,
  mergeDeepAll,
} from './src/utils/utils';

const categories = generateI18NResources(
  getContentByType('categories'),
  'categories',
);
const collections = generateI18NResources(
  getContentByType('collections'),
  'collections',
);
const exercises = generateI18NResources(
  getContentByType('exercises'),
  'exercises',
);

const ui = generateI18NResources(getContentByType('ui'));
const email = generateI18NResources(getContentByType('email'), 'email');
const tags = generateI18NResources(getContentByType('tags'), 'tags');

const i18n = mergeDeepAll(categories, collections, exercises, tags, ui, email);

const {contributors} = JSON.parse(
  readFileSync('../.all-contributorsrc', {encoding: 'utf8'}),
);

const featured = JSON.parse(
  readFileSync('./src/featured/content.json', {encoding: 'utf8'}),
);

const data = JSON.stringify({
  i18n,
  featured,
  contributors,
});

if (process.argv.length > 2) {
  writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}

console.log('Content built!');
