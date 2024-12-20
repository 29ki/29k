import {readFileSync, readdirSync, existsSync} from 'fs';
import * as path from 'path';
import {
  CLIENT_LANGUAGE_TAGS,
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../shared/src/i18n/constants';
import {
  is,
  isNil,
  keys,
  mergeDeepRight,
  mergeDeepWith,
  reduce,
  unapply,
  without,
} from 'ramda';

type LocalizedContent<T> = Record<LANGUAGE_TAG, Record<string, T>>;
type Content<T> = Record<string, LocalizedContent<T>>;

export const getContentByType = <T>(type: string, throwOnErrors = true) => {
  const dirPath = path.resolve('src', type);

  if (existsSync(dirPath)) {
    const dirFiles = readdirSync(dirPath);

    return dirFiles.reduce((files, fileName) => {
      const filePath = path.resolve(dirPath, fileName);
      const fileKey = path.basename(fileName, '.json');
      const file = readFileSync(filePath, {encoding: 'utf8'});
      const fileJSON = JSON.parse(file) as LocalizedContent<T>;
      const defaultLanguageContent = fileJSON[DEFAULT_LANGUAGE_TAG];
      const defaultLanguageKeys = keys(defaultLanguageContent);

      LANGUAGE_TAGS.forEach(languageTag => {
        const languageContent = fileJSON[languageTag];
        const languageKeys = keys(languageContent);

        // Make sure the content defines all available languages
        if (throwOnErrors && languageContent === undefined) {
          throw new Error(`${languageTag} is not defined for ${filePath}`);
        }

        // Make sure the ID matches the file name
        if (
          throwOnErrors &&
          'id' in defaultLanguageContent &&
          languageContent['id'] !== fileKey
        ) {
          throw new Error(
            `${languageTag} has different ID ${languageContent['id']} for ${filePath}`,
          );
        }

        // Make sure the keys matches DEFAULT_LANGUAGE
        const missingKeys = without(languageKeys, defaultLanguageKeys);
        if (
          type === 'ui' &&
          CLIENT_LANGUAGE_TAGS.includes(languageTag) &&
          missingKeys.length
        ) {
          console.warn(
            `🚨 ${languageTag} is missing keys "${missingKeys.join(
              '", "',
            )}" in ${filePath}`,
          );
        }
      });

      return {
        ...files,
        [fileKey]: fileJSON,
      };
    }, {} as Content<T>);
  }
  return {} as Content<T>;
};

/*
Generates i18n-friendly structure

{
  sv: {
    'UI.Common.Button': {
      saveButton: {
        text: 'Save',
      },
      saveButton_saving: {
        text: 'Saving',
      },
    },
  },
};
*/

export const generateI18NResources = <T>(
  content: Content<T>,
  parentNS?: string,
) =>
  Object.entries(content).reduce(
    (i18nResources, [namespace, locales]) =>
      Object.entries(locales).reduce(
        (resources: LocalizedContent<T>, [locale, resource]) => ({
          ...resources,
          [locale]: parentNS
            ? {
                [parentNS]: {
                  ...resources[locale as LANGUAGE_TAG]?.[parentNS],
                  [namespace]: resource,
                },
              }
            : {
                ...resources[locale as LANGUAGE_TAG],
                [namespace]: resource,
              },
        }),
        i18nResources,
      ),
    {} as LocalizedContent<T>,
  );

export const mergeDeepAll = unapply(reduce(mergeDeepRight, {}));

export const mergeWithArrays = (a: unknown, b: unknown) => {
  if (is(Array, a) && is(Array, b)) {
    return b.map((item, index) => mergeWithArrays(a[index], item));
  }

  if (is(Object, a) && is(Object, b)) {
    return mergeDeepWith(mergeWithArrays, a, b);
  }

  return isNil(a) ? b : a;
};
