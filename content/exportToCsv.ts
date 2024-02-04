import {flatten} from 'safe-flat';
import * as csv from '@fast-csv/format';
import {getContentByType} from './src/utils/utils';
import {DEFAULT_LANGUAGE_TAG} from '../shared/src/i18n/constants';
import {createWriteStream} from 'fs';

const types = ['categories', 'collections', 'exercises', 'tags', 'ui', 'email'];

const FROM_LANGUAGE_TAG = DEFAULT_LANGUAGE_TAG;

const [, , TO_LANGUAGE_TAG] = process.argv;

if (!TO_LANGUAGE_TAG) {
  throw new Error('Missing language argument');
}

const skipKeys = {
  categories: ['id', 'exercises', 'collections', 'lottie'],
  collections: ['id', 'coCreators', 'card', 'tags', 'exercises'],
  tags: ['id'],
  exercises: [
    'id',
    'type',
    'source',
    'preview',
    'image',
    'card',
    'coCreators',
    'audio',
    'subtitles',
    'textColor',
    'backgroundColor',
    'published',
    'tags',
  ],
};

const main = async () => {
  const data = await Promise.all(
    types.map(async type => ({
      type,
      content: await getContentByType(type),
    })),
  );

  data.forEach(({type, content}) => {
    const csvStream = csv.format({headers: true});
    csvStream.pipe(
      createWriteStream(`./content-${type}-${TO_LANGUAGE_TAG}.csv`),
    );

    csvStream.write([
      'Type',
      'File',
      'Key',
      FROM_LANGUAGE_TAG,
      TO_LANGUAGE_TAG,
    ]);

    Object.entries(content).forEach(([file, translations]) => {
      const fromTranslations = flatten(translations[FROM_LANGUAGE_TAG]);
      const toTranslations = flatten(translations[TO_LANGUAGE_TAG]);
      Object.entries(fromTranslations)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .forEach(([key, value]) => {
          if (
            value &&
            typeof value === 'string' &&
            !value.startsWith('http') &&
            !skipKeys[type]?.some(
              skip => key.startsWith(skip) || key.endsWith(skip),
            )
          ) {
            csvStream.write([type, file, key, value, toTranslations[key]]);
          }
        });
    });

    csvStream.end();
  });
};

main();
