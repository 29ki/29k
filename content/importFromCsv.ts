import {mergeDeepWith, uniq} from 'ramda';
import {unflatten} from 'safe-flat';
import * as csv from '@fast-csv/parse';
import {getContentByType, mergeWithArrays} from './src/utils/utils';
import {DEFAULT_LANGUAGE_TAG, LANGUAGE_TAG} from '../shared/src/i18n/constants';
import fs from 'fs';
import path from 'path';

const FROM_LANGUAGE_TAG = DEFAULT_LANGUAGE_TAG;

const [, , TO_LANGUAGE_TAG, CSV_FILE] = process.argv;

if (!TO_LANGUAGE_TAG) {
  throw new Error('Missing language argument');
}

if (!CSV_FILE) {
  throw new Error('Missing csv file argument');
}

const skipLanguageMergeForTypes = ['email', 'ui'];
const overridePublishedFlagForTypes = ['exercises'];

type Translation = {
  Type: string;
  File: string;
  Key: string;
} & {
  [key in LANGUAGE_TAG]: string;
};

async function readFileCsvFile(filePath: string): Promise<Translation[]> {
  return new Promise((resolve, reject) => {
    const data: Translation[] = [];
    csv
      .parseFile(filePath, {headers: true})
      .on('error', reject)
      .on('data', row => data.push(row))
      .on('end', () => resolve(data));
  });
}

const main = async () => {
  const data = await readFileCsvFile(CSV_FILE);
  const types = uniq(data.map(({Type}) => Type));
  types.forEach(type => {
    const typeContent = getContentByType(type);
    const typeTranslations = data.filter(({Type}) => Type === type);
    const files = uniq(typeTranslations.map(({File}) => File));
    files.forEach(fileKey => {
      const content = typeContent[fileKey];
      const fileTranslations = typeTranslations
        .filter(
          ({File, ...translations}) =>
            File === fileKey && translations[TO_LANGUAGE_TAG],
        )
        .reduce(
          (acc, {Key, ...translations}) => ({
            ...acc,
            [Key]: translations[TO_LANGUAGE_TAG],
          }),
          {},
        );

      if (Object.keys(fileTranslations).length) {
        const filePath = path.resolve('src', type, `${fileKey}.json`);
        const fileContent = {
          ...content,
          [TO_LANGUAGE_TAG]: mergeDeepWith(
            mergeWithArrays,
            unflatten(fileTranslations),
            mergeDeepWith(mergeWithArrays, content[TO_LANGUAGE_TAG], {
              ...(skipLanguageMergeForTypes.includes(type)
                ? {}
                : content[FROM_LANGUAGE_TAG]),
              ...(overridePublishedFlagForTypes.includes(type)
                ? {published: false}
                : {}),
            }),
          ),
        };

        fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
      }
    });
  });
};

main();
