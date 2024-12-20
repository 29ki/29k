import {readFileSync, writeFileSync} from 'fs';
import {getContentByType} from './src/utils/utils';
import path from 'path';

const typesWithIds = ['categories', 'collections', 'exercises', 'tags'];

typesWithIds.forEach(type => {
  const content = getContentByType(type, false);
  Object.entries(content).forEach(([fileKey, translations]) => {
    Object.entries(translations).forEach(([languageTag, translation]) => {
      if (translation.id !== fileKey) {
        const filePath = path.resolve('src', type, `${fileKey}.json`);
        console.log(
          `🚨 Fixing ID ${translation.id} for ${type}/${fileKey}/${languageTag}`,
        );

        translations = {
          ...translations,
          [languageTag]: {
            ...translation,
            id: fileKey,
          },
        };

        writeFileSync(filePath, JSON.stringify(translations, null, 2));
      }
    });
  });
});

console.log('Done!');
