import {readFileSync, readdirSync, existsSync} from 'fs';
import * as path from 'path';
import {LANGUAGE_TAG, LANGUAGE_TAGS} from '../../../shared/src/constants/i18n';

type LocalizedContent<T> = Record<LANGUAGE_TAG, Record<string, T>>;
type Content<T> = Record<string, LocalizedContent<T>>;

export const getContentByType = <T>(type: string) => {
  const dirPath = path.resolve('src', type);

  if (existsSync(dirPath)) {
    const dirFiles = readdirSync(dirPath);

    return dirFiles.reduce((files, fileName) => {
      const filePath = path.resolve(dirPath, fileName);
      const fileKey = path.basename(fileName, '.json');
      const file = readFileSync(filePath, {encoding: 'utf8'});
      const fileJSON = JSON.parse(file) as LocalizedContent<T>;

      // Make sure the content defines all available languages
      LANGUAGE_TAGS.forEach(languageTag => {
        if (fileJSON[languageTag] === undefined) {
          throw new Error(`${languageTag} is not defined for ${filePath}`);
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
