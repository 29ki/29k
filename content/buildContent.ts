import {readFileSync, writeFileSync} from 'fs';
import {mergeDeepRight} from 'ramda';
import {generateI18NResources, getContentByType} from './src/utils/utils';

const exerciseContent = getContentByType('exercises');

const exercises = generateI18NResources(exerciseContent, 'exercises');
const exerciseIds = Object.keys(exerciseContent);

const ui = generateI18NResources(getContentByType('ui'));

const i18n = mergeDeepRight(ui, exercises);

const {contributors} = JSON.parse(
  readFileSync('../.all-contributorsrc', {encoding: 'utf8'}),
);

const data = JSON.stringify({
  i18n,
  exerciseIds,
  contributors,
});

if (process.argv.length > 2) {
  writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}

console.log('Content built!');
