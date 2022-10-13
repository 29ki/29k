import {readFileSync, writeFileSync} from 'fs';
import {mergeDeepRight} from 'ramda';
import {DEFAULT_LANGUAGE_TAG} from '../shared/src/constants/i18n';
import {
  filterPublishedContent,
  generateI18NResources,
  getContentByType,
} from './src/utils/utils';
import {Exercise} from '../shared/src/types/generated/Exercise';
import {UIComponent} from '../shared/src/types/generated/UI';

const exerciseContent = getContentByType<Exercise>('exercises');
const exercises = generateI18NResources(
  filterPublishedContent(exerciseContent),
  'exercises',
);
const exerciseIds = Object.keys(
  filterPublishedContent(exerciseContent, DEFAULT_LANGUAGE_TAG),
);

const ui = generateI18NResources(getContentByType<UIComponent>('ui'));

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
