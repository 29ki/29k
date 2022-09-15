import fs from 'fs';
import path from 'path';

export const getContentByType = type => {
  const dirPath = path.resolve('src', type);
  const dirFiles = fs.readdirSync(dirPath);

  return dirFiles.reduce((files, fileName) => {
    const filePath = path.resolve(dirPath, fileName);
    const fileKey = path.basename(fileName, '.json');
    const file = fs.readFileSync(filePath);
    const fileJSON = JSON.parse(file);

    return {
      ...files,
      [fileKey]: fileJSON,
    };
  }, {});
};

export const filterPublishedContent = files =>
  Object.entries(files).reduce(
    (files, [file, content]) => ({
      ...files,
      [file]: Object.entries(content).reduce(
        (filtered, [locale, resource]) =>
          resource.published ? {...filtered, [locale]: resource} : filtered,
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
export const generateI18NResources = (content, parentNS) =>
  Object.entries(content).reduce(
    (i18nResources, [namespace, locales]) =>
      Object.entries(locales).reduce(
        (resources, [locale, resource]) => ({
          ...resources,
          [locale]: parentNS
            ? {
                [parentNS]: {
                  ...resources[locale],
                  [namespace]: resource,
                },
              }
            : {
                ...resources[locale],
                [namespace]: resource,
              },
        }),
        i18nResources,
      ),
    {},
  );
