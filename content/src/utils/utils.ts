import {readFileSync, readdirSync} from 'fs';
import * as path from 'path';

type LocalizedContent<T> = Record<string, Record<string, T> | string>;
type Content<T> = Record<string, LocalizedContent<T>>;

export const getContentByType = <T>(type: string) => {
  const dirPath = path.resolve('src', type);

  const dirFiles = readdirSync(dirPath);

  return dirFiles.reduce((files, fileName) => {
    const filePath = path.resolve(dirPath, fileName);
    const fileKey = path.basename(fileName, '.json');
    const file = readFileSync(filePath, {encoding: 'utf8'});
    const fileJSON = JSON.parse(file) as LocalizedContent<T>;

    return {
      ...files,
      [fileKey]: fileJSON,
    };
  }, {} as Content<T>);
};

export const filterPublishedContent = <T>(
  files: Content<T>,
  explicitLocale?: string,
) =>
  Object.entries(files)
    .filter(
      ([, content]) =>
        !explicitLocale ||
        (content?.[explicitLocale] as Record<string, boolean>)?.published,
    )
    .reduce(
      (files, [file, content]) => ({
        ...files,
        [file]: Object.entries(content).reduce(
          (filtered, [locale, resource]) =>
            (resource as Record<string, boolean>).published
              ? {...filtered, [locale]: resource}
              : filtered,
          {},
        ),
      }),
      {},
    );

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
                  ...(resources[locale] as Record<string, T>)?.[parentNS],
                  [namespace]: resource,
                },
              }
            : {
                ...(resources[locale] as Record<string, T>),
                [namespace]: resource,
              },
        }),
        i18nResources,
      ),
    {},
  );
